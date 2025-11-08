import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MCQQuestion } from '../types'
import { parseQuizMarkdown } from '../utils/markdownParser'
import QuestionMCQ from '../components/QuestionMCQ'
import ProgressBar from '../components/ProgressBar'
import { scoreFromMCQ, summarizeScore } from '../game/score'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useLeaderboard } from '../hooks/useLeaderboard'
import { useBeep } from '../hooks/useAudio'
import { analyzePersonality } from '../services/analysis'
import { useGeolocation } from '../hooks/useGeolocation'

// Import markdown từ root của repo
// Path từ src/pages/Game.tsx -> ../../quiz-tam-ly-vui-nhon.md
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import quizMd from '../../quiz-tam-ly-vui-nhon.md?raw'

export default function Game() {
  const navigate = useNavigate()
  const audio = useBeep()
  const { add } = useLeaderboard()
  
  // Lấy GPS location ngay khi vào trang game
  const { location: gpsLocation } = useGeolocation()

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
    // Lưu vào database (async) - truyền GPS data nếu có
    await add({
      name,
      score: finalScore.total,
      summary: summary.details,
      timestamp: Date.now(),
      analysisTitle: analysis?.title ?? undefined,
      analysisSummary: analysis?.summary ?? undefined,
    }, gpsLocation)
    setLoading(false)
    navigate('/result', { state: { score: finalScore, summary, analysis } })
  }

  const current = questions[index]
  const isLast = index === questions.length - 1

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Trắc nghiệm tâm lý vui nhộn</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Chọn đáp án tự nhiên nhất — giao diện game-based, mỗi câu có hiệu ứng tương tác. Hãy cùng khám phá bản thân!
        </p>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <Input
            type="text"
            placeholder="Tên hiển thị (tuỳ chọn)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="min-w-[240px] max-w-sm"
          />
        </div>
      </div>

      <ProgressBar current={index + 1} total={questions.length} />

      {current.kind === 'mcq' && (
        <QuestionMCQ 
          key={current.id} 
          question={current} 
          onAnswer={(key) => onAnswerMCQ(current.id, key)} 
        />
      )}

      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        {!isLast && (
          <Button 
            variant="outline" 
            onClick={onNext}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Bỏ qua
          </Button>
        )}
        {isLast && (
          <Button 
            variant="default" 
            onClick={finish} 
            disabled={loading}
            className="min-w-[160px] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Đang phân tích...' : 'Xem kết quả'}
          </Button>
        )}
      </div>
    </div>
  )
}
