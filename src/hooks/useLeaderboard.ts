import { useEffect, useState } from 'react'

export type LeaderboardItem = {
  name: string
  score: number
  summary: string
  timestamp: number
  analysisTitle?: string
  analysisSummary?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const KEY = 'psyquiz_leaderboard_v1'

// Fallback: đọc từ localStorage
function readBoardLocal(): LeaderboardItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return arr
  } catch {}
  return []
}

// Lưu vào localStorage làm backup
function saveBoardLocal(board: LeaderboardItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(board.slice(0, 50)))
  } catch {}
}

export function useLeaderboard() {
  const [board, setBoard] = useState<LeaderboardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load leaderboard từ API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_URL}/api/leaderboard`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: LeaderboardItem[] = await response.json()
        setBoard(data)
        // Lưu vào localStorage làm backup
        saveBoardLocal(data)
      } catch (err) {
        console.error('Failed to fetch leaderboard from API:', err)
        // Fallback: đọc từ localStorage
        const localData = readBoardLocal()
        setBoard(localData)
        setError('Không thể kết nối đến server. Đang hiển thị dữ liệu local.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const add = async (item: LeaderboardItem) => {
    try {
      // Gửi lên API
      const response = await fetch(`${API_URL}/api/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Reload leaderboard sau khi thêm thành công
      const updatedResponse = await fetch(`${API_URL}/api/leaderboard`)
      if (updatedResponse.ok) {
        const data: LeaderboardItem[] = await updatedResponse.json()
        setBoard(data)
        saveBoardLocal(data)
      } else {
        // Nếu reload thất bại, thêm vào local state
        const next = [...board, item]
        next.sort((a, b) => b.score - a.score)
        setBoard(next.slice(0, 50))
        saveBoardLocal(next)
      }
    } catch (err) {
      console.error('Failed to add to leaderboard via API:', err)
      // Fallback: lưu vào localStorage và state
      const next = [...readBoardLocal(), item]
      next.sort((a, b) => b.score - a.score)
      setBoard(next.slice(0, 50))
      saveBoardLocal(next)
      setError('Không thể lưu lên server. Đã lưu vào bộ nhớ local.')
    }
  }

  return { board, add, loading, error }
}
