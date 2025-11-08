// Tiện ích parse summary kiểu narrative thành các phần có cấu trúc
export type NarrativeParts = {
  inside?: string
  outside?: string
  hypothesis?: string
  disclaimer?: string
}

export function parseNarrativeSummary(summary: string): NarrativeParts | null {
  if (!summary || typeof summary !== 'string') return null
  const text = summary.replace(/\s+/g, ' ').trim()
  const parts: NarrativeParts = {}

  const insideMatch = text.match(/Bên trong \(Tư duy\/Cảm xúc\):\s*([\s\S]*?)(?= Bên ngoài \(Hành vi\):| Giả thuyết tổng thể:| Tuyên bố miễn trừ:|$)/)
  if (insideMatch) parts.inside = insideMatch[1].trim()

  const outsideMatch = text.match(/Bên ngoài \(Hành vi\):\s*([\s\S]*?)(?= Giả thuyết tổng thể:| Tuyên bố miễn trừ:|$)/)
  if (outsideMatch) parts.outside = outsideMatch[1].trim()

  const hypoMatch = text.match(/Giả thuyết tổng thể:\s*([\s\S]*?)(?= Tuyên bố miễn trừ:|$)/)
  if (hypoMatch) parts.hypothesis = hypoMatch[1].trim()

  const disclaimerMatch = text.match(/Tuyên bố miễn trừ:\s*([\s\S]*?)$/)
  if (disclaimerMatch) parts.disclaimer = disclaimerMatch[1].trim()

  const hasAny = parts.inside || parts.outside || parts.hypothesis || parts.disclaimer
  return hasAny ? parts : null
}
