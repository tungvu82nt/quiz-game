import { useState } from 'react'
import type { FillBlankQuestion } from '../types'
import { useBeep } from '../hooks/useAudio'

type Props = {
  question: FillBlankQuestion
  onAnswer: (correct: boolean, value: string) => void
}

export default function QuestionFillBlank({ question, onAnswer }: Props) {
  const [value, setValue] = useState('')
  const audio = useBeep()
  const submit = () => {
    const correct = value.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
    correct ? audio.correct() : audio.wrong()
    onAnswer(correct, value)
  }
  return (
    <div className="card quiz-card">
      <h2 className="prompt">{question.prompt}</h2>
      <div className="fill-row">
        <input
          type="text"
          value={value}
          placeholder={question.placeholder ?? 'Nhập đáp án...'}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={submit}>Trả lời</button>
      </div>
    </div>
  )
}
