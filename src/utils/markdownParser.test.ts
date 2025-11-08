import { describe, it, expect } from 'vitest'
import { parseQuizMarkdown } from './markdownParser'

const md = `\n1) Câu hỏi A?\n - A) Một\n - B) Hai\n - C) Ba\n - D) Bốn\n\n2) Câu hỏi B?\n - A) Alpha\n - B) Beta\n - C) Gamma\n - D) Delta\n`

describe('parseQuizMarkdown', () => {
  it('parses questions and four options', () => {
    const qs = parseQuizMarkdown(md)
    expect(qs.length).toBe(2)
    expect(qs[0].options.length).toBe(4)
    expect(qs[0].options[0].key).toBe('A')
    expect(qs[1].prompt).toContain('Câu hỏi B')
  })
})
