import type { MCQQuestion, OptionKey } from '../types'
import { useBeep } from '../hooks/useAudio'

type Props = {
  question: MCQQuestion
  onAnswer: (key: OptionKey) => void
}

export default function QuestionMCQ({ question, onAnswer }: Props) {
  const audio = useBeep()
  return (
    <div className="card quiz-card">
      {question.imageUrl && (
        <div className="question-image">
          <img src={question.imageUrl} alt="minh hoạ" />
        </div>
      )}
      <h2 className="prompt">{question.prompt}</h2>
      <div className="options">
        {question.options.map((opt) => (
          <button
            key={opt.key}
            className="option"
            onClick={() => {
              audio.click()
              onAnswer(opt.key)
            }}
          >
            <span className="opt-key">{opt.key})</span> {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}
