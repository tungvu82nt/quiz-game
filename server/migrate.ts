import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { query } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function migrate() {
  try {
    console.log('🔄 Running database migration...')
    
    // Đọc file schema.sql
    const schemaPath = join(__dirname, 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // Tách các câu lệnh SQL một cách thông minh hơn
    // Loại bỏ comment và chia theo dấu chấm phẩy
    const lines = schema.split('\n')
    let currentStatement = ''
    const statements: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      // Bỏ qua comment
      if (trimmed.startsWith('--') || trimmed === '') {
        continue
      }
      
      currentStatement += ' ' + trimmed
      
      // Nếu dòng kết thúc bằng dấu chấm phẩy, đó là kết thúc của một statement
      if (trimmed.endsWith(';')) {
        const stmt = currentStatement.trim()
        if (stmt) {
          statements.push(stmt)
        }
        currentStatement = ''
      }
    }
    
    // Nếu còn statement chưa kết thúc
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim())
    }
    
    console.log(`Found ${statements.length} SQL statements to execute`)
    
    // Chạy từng câu lệnh
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        await query(statement)
        console.log(`✅ [${i + 1}/${statements.length}] Executed successfully`)
      } catch (err: any) {
        console.error(`❌ [${i + 1}/${statements.length}] Error:`, err.message)
        console.error(`Statement: ${statement.substring(0, 100)}...`)
        throw err
      }
    }
    
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

