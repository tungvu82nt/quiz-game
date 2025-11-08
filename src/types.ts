export type OptionKey = 'A' | 'B' | 'C' | 'D'

export type MCQOption = {
  key: OptionKey
  text: string
}

export type BaseQuestion = {
  id: string
  prompt: string
  kind: 'mcq' | 'fill' | 'drag'
}

export type MCQQuestion = BaseQuestion & {
  kind: 'mcq'
  options: MCQOption[]
  imageUrl?: string
}

export type FillBlankQuestion = BaseQuestion & {
  kind: 'fill'
  placeholder?: string
  correctAnswer: string
}

export type DragDropPair = {
  left: string
  right: string
}

export type DragDropQuestion = BaseQuestion & {
  kind: 'drag'
  leftItems: string[]
  rightTargets: string[]
  solution: DragDropPair[]
}

export type Question = MCQQuestion | FillBlankQuestion | DragDropQuestion

export type Score = {
  extrovert: number // A
  systematic: number // B
  creative: number // C
  stable: number // D
  total: number
}

export type AnalysisResult = {
  title?: string
  summary: string
  traits?: string[]
}
