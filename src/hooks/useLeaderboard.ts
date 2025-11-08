import { useEffect, useState } from 'react'
import type { GeolocationData } from './useGeolocation'

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
  } catch (error) {
    // Ignore localStorage errors
    console.warn('Failed to read from localStorage:', error)
  }
  return []
}

// Lưu vào localStorage làm backup
function saveBoardLocal(board: LeaderboardItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(board.slice(0, 50)))
  } catch (error) {
    // Ignore localStorage errors (quota exceeded, etc.)
    console.warn('Failed to save to localStorage:', error)
  }
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

        // Log status and content type for debugging
        console.log('Response Status:', response.status)
        console.log('Content-Type:', response.headers.get('Content-Type'))
        console.log('API URL:', `${API_URL}/api/leaderboard`)

        // Check if the response is OK first
        if (!response.ok) {
          // Attempt to read as text for better error message if it's not OK
          const errorText = await response.text()
          console.error('Non-OK response:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('Content-Type'),
            preview: errorText.substring(0, 200),
          })
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}. Details: ${errorText.substring(0, 100)}...`
          )
        }

        // Check if the response is actually JSON
        const contentType = response.headers.get('Content-Type')
        if (!contentType || !contentType.includes('application/json')) {
          // If not JSON, read as text to see what we actually got
          const responseText = await response.text()
          console.error('Expected JSON but received non-JSON response:', {
            status: response.status,
            contentType: contentType || 'no Content-Type',
            url: `${API_URL}/api/leaderboard`,
            preview: responseText.substring(0, 200),
          })
          throw new Error(
            `Expected JSON but received ${contentType || 'no Content-Type'}. Response: ${responseText.substring(0, 100)}...`
          )
        }

        // Safe to parse as JSON now
        const data: LeaderboardItem[] = await response.json()
        setBoard(data)
        // Lưu vào localStorage làm backup
        saveBoardLocal(data)
        console.log('Successfully fetched leaderboard:', data.length, 'items')
      } catch (err) {
        console.error('Failed to fetch leaderboard from API:', err)
        // Fallback: đọc từ localStorage
        const localData = readBoardLocal()
        setBoard(localData)
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Không thể kết nối đến server. Đang hiển thị dữ liệu local.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const add = async (item: LeaderboardItem, gpsData?: GeolocationData | null) => {
    try {
      // Gửi lên API kèm GPS data nếu có
      const response = await fetch(`${API_URL}/api/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          gpsData: gpsData || null,
        }),
      })

      // Log status and content type for debugging
      console.log('POST Response Status:', response.status)
      console.log('POST Content-Type:', response.headers.get('Content-Type'))

      // Check if the response is OK first
      if (!response.ok) {
        // Attempt to read as text for better error message
        const errorText = await response.text()
        console.error('Non-OK response on POST:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('Content-Type'),
          preview: errorText.substring(0, 200),
        })
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}. Details: ${errorText.substring(0, 100)}...`
        )
      }

      // Check if the response is actually JSON
      const contentType = response.headers.get('Content-Type')
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, read as text to see what we actually got
        const responseText = await response.text()
        console.error('Expected JSON but received non-JSON response on POST:', {
          status: response.status,
          contentType: contentType || 'no Content-Type',
          preview: responseText.substring(0, 200),
        })
        throw new Error(
          `Expected JSON but received ${contentType || 'no Content-Type'}. Response: ${responseText.substring(0, 100)}...`
        )
      }

      // Parse the created item from response
      const createdItem: LeaderboardItem = await response.json()
      console.log('Successfully added to leaderboard:', createdItem)

      // Reload leaderboard sau khi thêm thành công
      const updatedResponse = await fetch(`${API_URL}/api/leaderboard`)
      if (updatedResponse.ok) {
        const updatedContentType = updatedResponse.headers.get('Content-Type')
        if (updatedContentType && updatedContentType.includes('application/json')) {
          const data: LeaderboardItem[] = await updatedResponse.json()
          setBoard(data)
          saveBoardLocal(data)
          console.log('Successfully reloaded leaderboard:', data.length, 'items')
        } else {
          // If reload returns non-JSON, use the created item and current board
          console.warn('Reload returned non-JSON, using created item')
          const next = [...board, createdItem]
          next.sort((a, b) => b.score - a.score)
          setBoard(next.slice(0, 50))
          saveBoardLocal(next)
        }
      } else {
        // Nếu reload thất bại, thêm vào local state
        console.warn('Reload failed, adding to local state')
        const next = [...board, createdItem]
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
      const errorMessage =
        err instanceof Error ? err.message : 'Không thể lưu lên server. Đã lưu vào bộ nhớ local.'
      setError(errorMessage)
    }
  }

  return { board, add, loading, error }
}
