import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MCQQuestion } from '../types'
import { parseQuizMarkdown } from '../utils/markdownParser'
import QuestionMCQ from '../components/QuestionMCQ'
import ProgressBar from '../components/ProgressBar'
import { scoreFromMCQ, summarizeScore } from '../game/score'

import { useLeaderboard } from '../hooks/useLeaderboard'
import { useBeep } from '../hooks/useAudio'
import { analyzePersonality } from '../services/analysis'

// Import markdown từ root của repo
// Path từ src/pages/Game.tsx -> ../../quiz-tam-ly-vui-nhon.md
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import quizMd from '../../quiz-tam-ly-vui-nhon.md?raw'

export default function Game() {
  const navigate = useNavigate()
  const audio = useBeep()
  const { add } = useLeaderboard()

  const mcq = useMemo<MCQQuestion[]>(() => parseQuizMarkdown(quizMd).slice(0, 10), [])
  const questions = mcq

  const [index, setIndex] = useState(0)
  const [answersMCQ, setAnswersMCQ] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({})
  const [loading, setLoading] = useState(false)
  const [playerName, setPlayerName] = useState('')

  const onNext = () => setIndex((i) => Math.min(i + 1, questions.length - 1))

  const onAnswerMCQ = (id: string, key: 'A' | 'B' | 'C' | 'D') => {
    setAnswersMCQ((prev) => ({ ...prev, [id]: key }))
    audio.correct() // âm thanh phản hồi nhanh
    onNext()
  }

  const finish = async () => {
    setLoading(true)
    const finalScore = scoreFromMCQ(mcq, answersMCQ)
    const summary = summarizeScore(finalScore)
    // Gọi AI phân tích với danh sách câu hỏi để có ngữ cảnh đầy đủ:
    const analysis = await analyzePersonality({ answers: answersMCQ, score: finalScore, questions: mcq })
    const name = playerName.trim() || 'Ẩn danh'
    // Lưu vào database (async)
    await add({
      name,
      score: finalScore.total,
      summary: summary.details,
      timestamp: Date.now(),
      analysisTitle: analysis?.title ?? undefined,
      analysisSummary: analysis?.summary ?? undefined,
    })
    setLoading(false)
    navigate('/result', { state: { score: finalScore, summary, analysis } })
  }

  const current = questions[index]
  const isLast = index === questions.length - 1

  return (
    <div className="container">
      <div className="intro">
        <h1>Trắc nghiệm tâm lý vui nhộn</h1>
        <p>Chọn đáp án tự nhiên nhất — giao diện game-based, mỗi câu có hiệu ứng tương tác. Hãy cùng khám phá bản thân!</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <input
            type="text"
            placeholder="Tên hiển thị (tuỳ chọn)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: 'inherit', minWidth: 240 }}
          />
        </div>
      </div>

      <ProgressBar current={index + 1} total={questions.length} />

      {current.kind === 'mcq' && (
        <QuestionMCQ question={current} onAnswer={(key) => onAnswerMCQ(current.id, key)} />
      )}

      <div className="actions">
        {!isLast && (
          <button onClick={onNext}>Bỏ qua</button>
        )}
        {isLast && (
          <button className="primary" onClick={finish} disabled={loading}>{loading ? 'Đang phân tích...' : 'Xem kết quả'}</button>
        )}
      </div>
    </div>
  )
}
