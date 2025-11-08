import express from 'express'
import cors from 'cors'
import { query } from './db.js'
import type { LeaderboardItem } from '../src/hooks/useLeaderboard.js'
import { ipTrackingMiddleware, getClientIp } from './middleware/ipTracking.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
// CORS: Cho phép tất cả origins (có thể tùy chỉnh cho production)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'https://leafy-sunflower-6cf24d.netlify.app']

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
// Sử dụng IP tracking middleware cho tất cả requests
app.use(ipTrackingMiddleware)

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
    const { name, score, summary, analysisTitle, analysisSummary, gpsData } = req.body

    // Validation
    if (!name || typeof score !== 'number' || !summary) {
      return res.status(400).json({ error: 'Missing required fields: name, score, summary' })
    }

    // Lấy IP address từ request (đã được attach bởi middleware)
    const clientIp = req.clientIp || getClientIp(req)

    // Insert vào leaderboard
    const result = await query(
      `INSERT INTO leaderboard (name, score, summary, analysis_title, analysis_summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, score, summary, analysis_title, analysis_summary,
       EXTRACT(EPOCH FROM created_at) * 1000 as timestamp`,
      [name, score, summary, analysisTitle || null, analysisSummary || null]
    )

    const leaderboardId = result.rows[0].id

    // Insert tracking data vào quiz_tracking (GPS và IP)
    try {
      await query(
        `INSERT INTO quiz_tracking (leaderboard_id, ip_address, latitude, longitude, accuracy)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          leaderboardId,
          clientIp,
          gpsData?.latitude || null,
          gpsData?.longitude || null,
          gpsData?.accuracy || null,
        ]
      )
      console.log(`✅ Tracking data saved for leaderboard_id: ${leaderboardId}, IP: ${clientIp}`)
    } catch (trackingError) {
      // Log lỗi tracking nhưng không fail request
      console.error('Error saving tracking data:', trackingError)
    }

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

// GET /api/tracking - Lấy dữ liệu tracking (GPS và IP)
app.get('/api/tracking', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100
    const result = await query(
      `SELECT 
        qt.id,
        qt.leaderboard_id,
        qt.ip_address,
        qt.latitude,
        qt.longitude,
        qt.accuracy,
        EXTRACT(EPOCH FROM qt.created_at) * 1000 as timestamp,
        l.name,
        l.score
       FROM quiz_tracking qt
       LEFT JOIN leaderboard l ON qt.leaderboard_id = l.id
       ORDER BY qt.created_at DESC
       LIMIT $1`,
      [limit]
    )

    const trackingData = result.rows.map((row) => ({
      id: row.id,
      leaderboardId: row.leaderboard_id,
      ipAddress: row.ip_address,
      latitude: row.latitude,
      longitude: row.longitude,
      accuracy: row.accuracy,
      timestamp: parseInt(row.timestamp),
      userName: row.name,
      score: row.score,
    }))

    res.json(trackingData)
  } catch (error) {
    console.error('Error fetching tracking data:', error)
    res.status(500).json({ error: 'Failed to fetch tracking data' })
  }
})

// GET /api/tracking/stats - Thống kê tracking
app.get('/api/tracking/stats', async (req, res) => {
  try {
    const stats = await query(
      `SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(latitude) as gps_records,
        MIN(created_at) as first_record,
        MAX(created_at) as last_record
       FROM quiz_tracking`
    )

    const result = stats.rows[0]
    res.json({
      totalRecords: parseInt(result.total_records),
      uniqueIPs: parseInt(result.unique_ips),
      gpsRecords: parseInt(result.gps_records),
      firstRecord: result.first_record,
      lastRecord: result.last_record,
    })
  } catch (error) {
    console.error('Error fetching tracking stats:', error)
    res.status(500).json({ error: 'Failed to fetch tracking stats' })
  }
})

// Khởi động server với error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})

// Xử lý lỗi khi port đã được sử dụng
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`)
    console.error(`💡 Solutions:`)
    console.error(`   1. Stop the process using port ${PORT}`)
    console.error(`   2. Or change PORT in .env file to another port (e.g., 3002, 3003)`)
    console.error(`   3. Or kill the process: Get-Process -Id <PID> | Stop-Process`)
    console.error(`\n📋 Process using port ${PORT}:`)
    console.error(`   Run: netstat -ano | findstr ":${PORT}"`)
    process.exit(1)
  } else {
    console.error('❌ Server error:', err)
    process.exit(1)
  }
})

