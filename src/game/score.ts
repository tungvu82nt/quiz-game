import type { MCQQuestion, OptionKey, Score } from '../types'

export type AnswerRecord = {
  id: string
  kind: 'mcq' | 'fill' | 'drag'
  selected?: OptionKey
  correct?: boolean
}

export function initialScore(): Score {
  return { extrovert: 0, systematic: 0, creative: 0, stable: 0, total: 0 }
}

// Map key -> dimension
const keyToDim: Record<OptionKey, keyof Score> = {
  A: 'extrovert',
  B: 'systematic',
  C: 'creative',
  D: 'stable',
}

// Tính điểm từ câu hỏi trắc nghiệm: mỗi lựa chọn +1 cho chiều tương ứng
export function scoreFromMCQ(questions: MCQQuestion[], answers: Record<string, OptionKey>): Score {
  const s = initialScore()
  for (const q of questions) {
    const sel = answers[q.id]
    if (!sel) continue
    const dim = keyToDim[sel]
    s[dim] += 1
    s.total += 1
  }
  return s
}

export function mergeScores(a: Score, b: Score): Score {
  return {
    extrovert: a.extrovert + b.extrovert,
    systematic: a.systematic + b.systematic,
    creative: a.creative + b.creative,
    stable: a.stable + b.stable,
    total: a.total + b.total,
  }
}

export function summarizeScore(s: Score): { label: string; details: string } {
  const dims: Array<{ key: keyof Score; label: string }> = [
    { key: 'extrovert', label: 'Hướng ngoại' },
    { key: 'systematic', label: 'Hệ thống' },
    { key: 'creative', label: 'Sáng tạo' },
    { key: 'stable', label: 'Ổn định' },
  ]
  const max = Math.max(s.extrovert, s.systematic, s.creative, s.stable)
  const top = dims.filter((d) => s[d.key] === max).map((d) => d.label)
  const label = top.length > 1 ? top.join(' + ') : top[0]
  const details = `Tổng ${s.total} điểm. Xu hướng nổi trội: ${label}.`
  return { label, details }
}
