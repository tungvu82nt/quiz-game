import express from 'express'
import cors from 'cors'
import { query } from './db.js'
import type { LeaderboardItem } from '../src/hooks/useLeaderboard.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' })
})

// GET /api/leaderboard - Lấy danh sách leaderboard (top 50)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, score, summary, analysis_title, analysis_summary, 
       EXTRACT(EPOCH FROM created_at) * 1000 as timestamp
       FROM leaderboard 
       ORDER BY score DESC, created_at DESC 
       LIMIT 50`
    )

    const board: LeaderboardItem[] = result.rows.map((row) => ({
      name: row.name,
      score: row.score,
      summary: row.summary,
      timestamp: parseInt(row.timestamp),
      analysisTitle: row.analysis_title || undefined,
      analysisSummary: row.analysis_summary || undefined,
    }))

    res.json(board)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// POST /api/leaderboard - Thêm kết quả mới vào leaderboard
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, score, summary, analysisTitle, analysisSummary } = req.body

    // Validation
    if (!name || typeof score !== 'number' || !summary) {
      return res.status(400).json({ error: 'Missing required fields: name, score, summary' })
    }

    const result = await query(
      `INSERT INTO leaderboard (name, score, summary, analysis_title, analysis_summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, score, summary, analysis_title, analysis_summary,
       EXTRACT(EPOCH FROM created_at) * 1000 as timestamp`,
      [name, score, summary, analysisTitle || null, analysisSummary || null]
    )

    const item: LeaderboardItem = {
      name: result.rows[0].name,
      score: result.rows[0].score,
      summary: result.rows[0].summary,
      timestamp: parseInt(result.rows[0].timestamp),
      analysisTitle: result.rows[0].analysis_title || undefined,
      analysisSummary: result.rows[0].analysis_summary || undefined,
    }

    res.status(201).json(item)
  } catch (error) {
    console.error('Error adding to leaderboard:', error)
    res.status(500).json({ error: 'Failed to add to leaderboard' })
  }
})

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})

