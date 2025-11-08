import { useEffect, useState } from 'react'
import type { DragDropQuestion, DragDropPair } from '../types'
import { useBeep } from '../hooks/useAudio'

type Props = {
  question: DragDropQuestion
  onAnswer: (correct: boolean, pairs: DragDropPair[]) => void
}

export default function QuestionDragDrop({ question, onAnswer }: Props) {
  const [pairs, setPairs] = useState<DragDropPair[]>([])
  const audio = useBeep()

  useEffect(() => {
    // init pairs with empty right
    setPairs(question.leftItems.map((l) => ({ left: l, right: '' })))
  }, [question])

  const drop = (left: string, right: string) => {
    setPairs((prev) => prev.map((p) => (p.left === left ? { ...p, right } : p)))
  }

  const check = () => {
    const correct = pairs.every((p) => question.solution.some((s) => s.left === p.left && s.right === p.right))
    correct ? audio.correct() : audio.wrong()
    onAnswer(correct, pairs)
  }

  return (
    <div className="card quiz-card">
      <h2 className="prompt">{question.prompt}</h2>
      <div className="drag-grid">
        <div className="drag-left">
          {question.leftItems.map((l) => (
            <div key={l} className="drag-item" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', l)}>
              {l}
            </div>
          ))}
        </div>
        <div className="drag-right">
          {question.rightTargets.map((r) => (
            <div
              key={r}
              className="drag-target"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const left = e.dataTransfer.getData('text/plain')
                drop(left, r)
              }}
            >
              <span className="target-label">{r}</span>
              <div className="target-assigned">{pairs.find((p) => p.right === r)?.left ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="primary" onClick={check}>
        Nộp bài
      </button>
    </div>
  )
}
