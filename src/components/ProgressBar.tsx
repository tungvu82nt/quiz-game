import { Progress } from "@/components/ui/progress"

type Props = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const value = Math.round((current / total) * 100)
  return (
    <div className="flex items-center gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Progress value={value} className="flex-1 h-3 transition-all duration-500 ease-out" />
      <div className="text-sm font-semibold min-w-[60px] text-right text-muted-foreground">
        {current}/{total}
      </div>
    </div>
  )
}
