import type { MCQQuestion, OptionKey } from '../types'

// Parse nội dung markdown linh hoạt để tạo danh sách câu hỏi trắc nghiệm
// Hỗ trợ định dạng:
// - Câu hỏi: "1) ..." hoặc "1. ..." (có hoặc không **bold**)
// - Đáp án: "- A) ...", "A) ...", "(A) ...", "- (A) ..."
export function parseQuizMarkdown(md: string): MCQQuestion[] {
  const lines = md.split(/\r?\n/)
  const questions: MCQQuestion[] = []
  let current: { prompt: string; options: { key: OptionKey; text: string }[]; imageUrl?: string } | null = null
  let qIndex = 0

  for (const raw of lines) {
    let line = raw.trim()
    if (!line) continue

    // Loại bỏ ** bold ** nếu có
    if (line.startsWith('**') && line.endsWith('**')) {
      line = line.slice(2, -2).trim()
    }

    // Match câu hỏi: "1) ..." hoặc "1. ..."
    const qMatchParen = line.match(/^\d+\)\s*(.+)$/)
    const qMatchDot = line.match(/^\d+\.\s*(.+)$/)
    const qText = qMatchParen?.[1] ?? qMatchDot?.[1]
    if (qText) {
      // Push question cũ nếu có
      if (current) {
        questions.push({
          id: `q${qIndex}`,
          kind: 'mcq',
          prompt: current.prompt,
          options: current.options,
        })
        qIndex += 1
      }
      current = { prompt: qText.trim(), options: [] }
      continue
    }

    // Match đáp án: nhiều kiểu khác nhau
    // 1) "- A) ..."
    let aMatch = line.match(/^[-*]\s*([ABCD])\)\s*(.+)$/)
    // 2) "A) ..."
    if (!aMatch) aMatch = line.match(/^([ABCD])\)\s*(.+)$/)
    // 3) "(A) ..."
    if (!aMatch) aMatch = line.match(/^\(([ABCD])\)\s*(.+)$/)
    // 4) "- (A) ..."
    if (!aMatch) aMatch = line.match(/^[-*]\s*\(([ABCD])\)\s*(.+)$/)

    if (aMatch && current) {
      const key = aMatch[1] as OptionKey
      const text = aMatch[2].trim()
      current.options.push({ key, text })
      continue
    }

    // Match ảnh dạng markdown: ![alt](path)
    const imgMatch = line.match(/^!\[[^\]]*\]\(([^)]+)\)/)
    if (imgMatch && current) {
      const rawPath = imgMatch[1].trim()
      // Chuẩn hoá đường dẫn: nếu bắt đầu bằng "image/quiz-tam-ly-vui-nhon/" thì chuyển về "/quiz-tam-ly-vui-nhon/..."
      const normalized = rawPath.replace(/^image\/quiz-tam-ly-vui-nhon\//, '/quiz-tam-ly-vui-nhon/')
      current.imageUrl = normalized
      continue
    }
  }

  // Push câu hỏi cuối
  if (current) {
    questions.push({
      id: `q${qIndex}`,
      kind: 'mcq',
      prompt: current.prompt,
      options: current.options,
      imageUrl: current.imageUrl,
    })
  }

  // Lọc những câu không đủ lựa chọn (chấp nhận từ 3 trở lên)
  return questions.filter((q) => q.options.length >= 3)
}
