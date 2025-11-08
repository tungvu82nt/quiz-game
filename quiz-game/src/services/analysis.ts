import type { AnalysisResult, Score, MCQQuestion } from '../types'
import { rolePrompt, conciseThreeAxesPrompt, narrativeThreeAxesPrompt } from '../prompts/psychometricExpert'

type AnalyzePayload = {
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
  score: Score
  questions?: MCQQuestion[]
}

export async function analyzePersonality(payload: AnalyzePayload): Promise<AnalysisResult | null> {
  const baseUrl = import.meta.env.VITE_ANALYSIS_API_URL as string | undefined
  const apiKey = import.meta.env.VITE_ANALYSIS_API_KEY as string | undefined
  let apiPath = (import.meta.env.VITE_ANALYSIS_API_PATH as string | undefined) ?? 'chat/completions'
  const model = import.meta.env.VITE_ANALYSIS_MODEL as string | undefined
  const useMock = (import.meta.env.VITE_ANALYSIS_USE_MOCK as string | undefined) === '1'

  if (!baseUrl && !useMock) {
    // Không có cấu hình API: trả về gợi ý mặc định
    return {
      title: 'Phân tích sơ bộ',
      summary:
        'Chưa cấu hình API phân tích bên ngoài (.env). Tóm tắt sơ bộ dựa trên điểm: nếu A/B/C/D cao hơn các nhóm khác, đó là xu hướng nổi trội. Hãy thêm VITE_ANALYSIS_API_URL và (tuỳ chọn) VITE_ANALYSIS_API_KEY vào .env để nhận phân tích chuyên sâu.',
      traits: [],
    }
  }

  try {
    // Nếu cấu hình yêu cầu dùng mock, trả về kết quả mô phỏng tại client
    if (useMock) {
      const promptStyle = (import.meta.env.VITE_PROMPT_STYLE as string | undefined) ?? 'default'
      return buildMockAnalysis(payload, promptStyle)
    }
    // Ghép URL an toàn, không làm rơi "/v1" khi apiPath có leading slash
    apiPath = apiPath.replace(/^\/+/, '')
    const fullUrl = baseUrl.replace(/\/+$/, '') + '/' + apiPath
    // Chuẩn bị ngữ cảnh bài làm: ánh xạ key -> text
    const items = (payload.questions ?? []).map((q) => {
      const sel = payload.answers[q.id]
      const optText = q.options.find((o) => o.key === sel)?.text ?? ''
      return {
        id: q.id,
        prompt: q.prompt,
        selectedKey: sel,
        selectedText: optText,
      }
    })

    const promptStyle = (import.meta.env.VITE_PROMPT_STYLE as string | undefined) ?? 'default'
    const instruction = promptStyle === 'concise' ? conciseThreeAxesPrompt : promptStyle === 'narrative' ? narrativeThreeAxesPrompt : rolePrompt

    const body = {
      model,
      task: 'personality_analysis',
      input: {
        answers: payload.answers,
        score: payload.score,
        items,
      },
      instruction,
    }

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error(`API error ${res.status}`)
    }
    const data = await res.json()

    // Chuẩn hoá dữ liệu trả về, hỗ trợ nhiều dạng response phổ biến của AI API
    function safeString(v: unknown): string | undefined {
      return typeof v === 'string' ? v : undefined
    }

    function tryParseJSON(text: string): { title?: string; summary?: string; traits?: string[] } | null {
      try {
        const obj = JSON.parse(text)
        if (obj && typeof obj === 'object') return obj
      } catch {}
      return null
    }

    let title = safeString((data as any)?.title) ?? 'Phân tích AI'
    let summary = safeString((data as any)?.summary)
    let traits: string[] | undefined = Array.isArray((data as any)?.traits)
      ? ((data as any)?.traits as unknown[]).filter((t: unknown) => typeof t === 'string') as string[]
      : undefined

    // Nếu không có summary ở top-level, thử các format phổ biến
    if (!summary) {
      const choices = (data as any)?.choices
      if (Array.isArray(choices) && choices.length > 0) {
        const ch = choices[0]
        const msgContent = safeString(ch?.message?.content)
        const text = safeString(ch?.text) ?? msgContent
        if (text) {
          const parsed = tryParseJSON(text)
          if (parsed?.summary) {
            title = parsed.title ?? title
            summary = parsed.summary
            traits = Array.isArray(parsed.traits) ? parsed.traits.filter((t) => typeof t === 'string') : traits
          } else {
            summary = text
          }
        }
      }
    }

    // Một số API trả về theo keys khác
    if (!summary) {
      summary = safeString((data as any)?.output_text) ?? safeString((data as any)?.result)
    }

    // Fallback cuối cùng nếu vẫn không trích xuất được
    summary = summary ?? 'Kết quả phân tích đã được cập nhật.'
    return { title, summary, traits }
  } catch (err) {
    console.error('Analyze error:', err)
    // Nếu lỗi, thử trả mock để không làm gián đoạn trải nghiệm
    if (useMock) {
      const promptStyle = (import.meta.env.VITE_PROMPT_STYLE as string | undefined) ?? 'default'
      return buildMockAnalysis(payload, promptStyle)
    }
    return {
      title: 'Phân tích gặp sự cố',
      summary: 'Không thể kết nối API phân tích. Vui lòng kiểm tra lại cấu hình .env hoặc thử lại sau.',
      traits: [],
    }
  }
}

function buildMockAnalysis(payload: AnalyzePayload, style: string): AnalysisResult {
  const s = payload.score
  const topDims = Object.entries({
    'Hướng ngoại': s.extrovert,
    'Hệ thống': s.systematic,
    'Sáng tạo': s.creative,
    'Ổn định': s.stable,
  }).sort((a, b) => b[1] - a[1])

  const top1 = topDims[0]?.[0]
  const top2 = topDims[1]?.[0]

  const cognition =
    s.systematic >= s.creative
      ? 'Tư duy thiên về phân tích và cấu trúc, ưu tiên lý lẽ, trật tự và tính nhất quán.'
      : 'Tư duy linh hoạt và sáng tạo, ưu tiên trực giác, ý tưởng mới và khả năng thích ứng.'

  const affect =
    s.stable >= s.extrovert
      ? 'Cảm xúc khá ổn định, điều tiết tốt, hiếm khi bị cuốn quá mạnh theo tác động bên ngoài.'
      : 'Cảm xúc nhạy bén, dễ cộng hưởng với môi trường xã hội, cần điểm tựa để cân bằng khi áp lực tăng.'

  const behavior =
    s.extrovert >= s.systematic
      ? 'Hành vi thiên về chủ động xã hội, kết nối và phản hồi nhanh; đôi khi cần tăng mức độ kiên định trong quyết định.'
      : 'Hành vi thiên về thận trọng, từng bước và có kế hoạch; đôi khi cần linh hoạt hơn khi cơ hội xuất hiện bất ngờ.'

  const disclaimer = 'Tuyên bố miễn trừ: Phân tích này mang tính tham khảo, không thay thế cho chẩn đoán hoặc tư vấn tâm lý chuyên nghiệp.'

  if (style === 'narrative') {
    const summary = [
      `Bên trong (Tư duy/Cảm xúc): ${cognition} ${affect}`,
      `Bên ngoài (Hành vi): ${behavior}`,
      `Giả thuyết tổng thể: Xu hướng nổi trội là ${top1}${top2 ? ' + ' + top2 : ''}. Bạn có khả năng phát triển tốt khi kết hợp điểm mạnh hiện có với việc rèn luyện phần còn lại để đạt cân bằng.`,
      disclaimer,
    ].join('\n')
    return { title: 'Phân tích mô phỏng (narrative)', summary, traits: [top1 ?? ''] }
  }

  if (style === 'concise') {
    const summary = [
      `Tư duy: ${cognition}`,
      `Cảm xúc: ${affect}`,
      `Hành vi: ${behavior}`,
      disclaimer,
    ].join('\n')
    return { title: 'Phân tích mô phỏng (concise)', summary, traits: [top1 ?? ''] }
  }

  // default detailed
  const summary = [
    `Đặc điểm nổi trội: ${top1}${top2 ? ' + ' + top2 : ''}. Tổng điểm: ${s.total}.`,
    `Điểm mạnh: ${s.systematic >= s.creative ? 'Tư duy hệ thống, lập kế hoạch, kiên định.' : 'Tư duy sáng tạo, linh hoạt, thích ứng tốt.'}`,
    `Thách thức: ${s.extrovert >= s.stable ? 'Dễ bị nhiễu bởi môi trường xã hội, cần điều tiết nhịp độ.' : 'Đôi khi thận trọng quá mức, cần tăng độ chủ động khi cần.'}`,
    `Liên kết mô hình: ${cognition} ${affect} ${behavior}`,
    `Lời khuyên: Duy trì thế mạnh hiện có và rèn luyện phần còn lại để cân bằng giữa phân tích – sáng tạo – ổn định – kết nối xã hội.`,
    disclaimer,
  ].join('\n')
  return { title: 'Phân tích mô phỏng (chi tiết)', summary, traits: [top1 ?? ''] }
}
