type Props = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="progress">
      <div className="progress-track">
        <div className="progress-thumb" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">{current}/{total}</div>
    </div>
  )
}
