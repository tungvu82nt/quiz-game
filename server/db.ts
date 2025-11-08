import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Parse connection string từ Neon PostgreSQL
const connectionString = process.env.DATABASE_URL || ''

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Tạo connection pool
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Neon yêu cầu SSL
  },
})

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err)
})

// Helper function để query
export async function query(text: string, params?: unknown[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

