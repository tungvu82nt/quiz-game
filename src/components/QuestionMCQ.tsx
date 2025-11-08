import { useState, useEffect } from 'react'
import type { MCQQuestion, OptionKey } from '../types'
import { useBeep } from '../hooks/useAudio'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Props = {
  question: MCQQuestion
  onAnswer: (key: OptionKey) => void
}

export default function QuestionMCQ({ question, onAnswer }: Props) {
  const audio = useBeep()
  const [selectedValue, setSelectedValue] = useState<string>('')

  // Reset selected value when question changes
  useEffect(() => {
    setSelectedValue('')
  }, [question.id])

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    audio.click()
    onAnswer(value as OptionKey)
  }

  return (
    <Card className="p-8">
      {question.imageUrl && (
        <div className="flex justify-center mb-4">
          <img 
            src={question.imageUrl} 
            alt="minh hoạ" 
            className="max-w-full rounded-xl border border-border"
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-6 leading-tight">{question.prompt}</h2>
      <CardContent className="p-0">
        <RadioGroup value={selectedValue} onValueChange={handleValueChange} className="space-y-3">
          {question.options.map((opt) => (
            <div key={opt.key} className="flex items-center space-x-3">
              <RadioGroupItem value={opt.key} id={`option-${opt.key}`} />
              <Label
                htmlFor={`option-${opt.key}`}
                className={cn(
                  "flex-1 text-left p-4 rounded-xl border-2 border-input bg-background cursor-pointer transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                  selectedValue === opt.key && "border-primary bg-accent shadow-md scale-[1.02]"
                )}
              >
                <span className="font-bold text-primary mr-2">{opt.key})</span>
                {opt.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
