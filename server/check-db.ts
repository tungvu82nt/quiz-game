import { query } from './db.js'

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n')

    // Kiểm tra bảng leaderboard
    try {
      const leaderboardCheck = await query(`SELECT COUNT(*) as count FROM leaderboard`)
      console.log(`✅ leaderboard table: ${leaderboardCheck.rows[0].count} records`)
    } catch (error: any) {
      console.error(`❌ leaderboard table error: ${error.message}`)
      console.log('⚠️  Run migration first: npm run db:migrate')
      process.exit(1)
    }

    // Kiểm tra bảng quiz_tracking
    try {
      const trackingCheck = await query(`SELECT COUNT(*) as count FROM quiz_tracking`)
      console.log(`✅ quiz_tracking table: ${trackingCheck.rows[0].count} records`)
    } catch (error: any) {
      console.error(`❌ quiz_tracking table error: ${error.message}`)
      if (error.message.includes('does not exist')) {
        console.log('⚠️  Table does not exist. Run migration first: npm run db:migrate')
      }
      process.exit(1)
    }

    // Kiểm tra tracking data chi tiết
    try {
      const trackingData = await query(
        `SELECT 
          qt.id,
          qt.ip_address,
          qt.latitude,
          qt.longitude,
          qt.accuracy,
          l.name,
          l.score,
          qt.created_at
         FROM quiz_tracking qt
         LEFT JOIN leaderboard l ON qt.leaderboard_id = l.id
         ORDER BY qt.created_at DESC
         LIMIT 10`
      )

      if (trackingData.rows.length > 0) {
        console.log(`\n📊 Latest tracking records (${trackingData.rows.length}):`)
        trackingData.rows.forEach((row, idx) => {
          const gpsInfo = row.latitude
            ? `GPS: ${row.latitude.toFixed(6)}, ${row.longitude.toFixed(6)} (acc: ${row.accuracy?.toFixed(0)}m)`
            : 'GPS: N/A'
          console.log(
            `   ${idx + 1}. IP: ${row.ip_address.padEnd(20)} | ${gpsInfo.padEnd(50)} | User: ${row.name || 'N/A'} | Score: ${row.score || 'N/A'}`
          )
        })
      } else {
        console.log('\n📊 No tracking records found yet.')
      }
    } catch (error: any) {
      console.error(`❌ Error fetching tracking data: ${error.message}`)
    }

    // Thống kê
    try {
      const stats = await query(
        `SELECT 
          COUNT(*) as total,
          COUNT(DISTINCT ip_address) as unique_ips,
          COUNT(latitude) as with_gps,
          COUNT(CASE WHEN latitude IS NULL THEN 1 END) as without_gps
         FROM quiz_tracking`
      )

      const stat = stats.rows[0]
      console.log(`\n📈 Statistics:`)
      console.log(`   Total records: ${stat.total}`)
      console.log(`   Unique IPs: ${stat.unique_ips}`)
      console.log(`   With GPS: ${stat.with_gps}`)
      console.log(`   Without GPS: ${stat.without_gps}`)

      // IP distribution
      if (parseInt(stat.total) > 0) {
        const ipStats = await query(
          `SELECT 
            ip_address,
            COUNT(*) as count
           FROM quiz_tracking
           GROUP BY ip_address
           ORDER BY count DESC
           LIMIT 5`
        )

        if (ipStats.rows.length > 0) {
          console.log(`\n🌐 Top IPs:`)
          ipStats.rows.forEach((row, idx) => {
            console.log(`   ${idx + 1}. ${row.ip_address}: ${row.count} records`)
          })
        }
      }
    } catch (error: any) {
      console.error(`❌ Error fetching stats: ${error.message}`)
    }

    console.log('\n✅ Database check completed!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error checking database:', error.message)
    process.exit(1)
  }
}

checkDatabase()

