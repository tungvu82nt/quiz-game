import { useRef } from 'react'

export function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null)
  const ensureCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return ctxRef.current!
  }

  const beep = (freq = 880, duration = 120) => {
    const ctx = ensureCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    gain.gain.value = 0.1
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    setTimeout(() => osc.stop(), duration)
  }

  return {
    correct: () => beep(1000, 150),
    wrong: () => beep(220, 200),
    click: () => beep(600, 80),
  }
}
