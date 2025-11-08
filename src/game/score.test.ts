import { describe, it, expect } from 'vitest'
import { initialScore, scoreFromMCQ, summarizeScore } from './score'

const questions = [
  { id: 'q1', kind: 'mcq', prompt: 'x', options: [
    { key: 'A', text: 'a' }, { key: 'B', text: 'b' }, { key: 'C', text: 'c' }, { key: 'D', text: 'd' }
  ] },
  { id: 'q2', kind: 'mcq', prompt: 'y', options: [
    { key: 'A', text: 'a' }, { key: 'B', text: 'b' }, { key: 'C', text: 'c' }, { key: 'D', text: 'd' }
  ] },
]

describe('score', () => {
  it('initialScore is zeroed', () => {
    const s = initialScore()
    expect(s.total).toBe(0)
  })
  it('scoreFromMCQ counts selections', () => {
    const s = scoreFromMCQ(questions as any, { q1: 'A', q2: 'D' })
    expect(s.extrovert).toBe(1)
    expect(s.stable).toBe(1)
    expect(s.total).toBe(2)
  })
  it('summarizeScore produces label', () => {
    const s = scoreFromMCQ(questions as any, { q1: 'B', q2: 'B' })
    const summary = summarizeScore(s)
    expect(summary.label).toContain('Hệ thống')
  })
})
