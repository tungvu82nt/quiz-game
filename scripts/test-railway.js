#!/usr/bin/env node

/**
 * Script để test Railway API endpoints
 * Usage: node scripts/test-railway.js [railway-url]
 * Example: node scripts/test-railway.js https://quiz-game-production-a421.up.railway.app
 */

const RAILWAY_URL = process.argv[2] || 'https://quiz-game-production-a421.up.railway.app'

async function testRailway() {
  console.log('🚂 Testing Railway Backend API...\n')
  console.log(`Railway URL: ${RAILWAY_URL}\n`)

  let allTestsPassed = true

  // Test 1: Health check
  console.log('1. Testing /health endpoint...')
  try {
    const response = await fetch(`${RAILWAY_URL}/health`)
    const contentType = response.headers.get('content-type')
    const text = await response.text()

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(text)
      if (response.ok && data.status === 'ok') {
        console.log('   ✅ Health check passed:', data)
      } else {
        console.log('   ❌ Health check failed:', data)
        allTestsPassed = false
      }
    } else {
      console.log('   ❌ Expected JSON but received:', contentType)
      console.log('   Response preview:', text.substring(0, 200))
      console.log('   ⚠️  Railway might be serving frontend instead of backend')
      console.log('   💡 Check Railway Settings > Deploy > Start Command = "npm run server"')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message)
    allTestsPassed = false
  }

  // Test 2: GET /api/leaderboard
  console.log('\n2. Testing GET /api/leaderboard...')
  try {
    const response = await fetch(`${RAILWAY_URL}/api/leaderboard`)
    const contentType = response.headers.get('content-type')
    const text = await response.text()

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(text)
      if (response.ok && Array.isArray(data)) {
        console.log(`   ✅ Leaderboard fetched: ${data.length} items`)
      } else {
        console.log('   ❌ Leaderboard fetch failed:', data)
        allTestsPassed = false
      }
    } else {
      console.log('   ❌ Expected JSON but received:', contentType)
      console.log('   Response preview:', text.substring(0, 200))
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Leaderboard fetch error:', error.message)
    allTestsPassed = false
  }

  // Test 3: POST /api/leaderboard
  if (allTestsPassed) {
    console.log('\n3. Testing POST /api/leaderboard...')
    try {
      const testItem = {
        name: 'Railway Test User',
        score: 10,
        summary: 'Test from Railway deployment',
        timestamp: Date.now(),
      }

      const response = await fetch(`${RAILWAY_URL}/api/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testItem),
      })

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        if (response.ok && data.name === testItem.name) {
          console.log('   ✅ Item added successfully:', data.name)
        } else {
          console.log('   ❌ Item add failed:', data)
          allTestsPassed = false
        }
      } else {
        console.log('   ❌ Expected JSON but received:', contentType)
        allTestsPassed = false
      }
    } catch (error) {
      console.log('   ❌ Item add error:', error.message)
      allTestsPassed = false
    }
  }

  // Test 4: CORS headers
  console.log('\n4. Testing CORS headers...')
  try {
    const response = await fetch(`${RAILWAY_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://leafy-sunflower-6cf24d.netlify.app',
      },
    })
    const corsHeader = response.headers.get('access-control-allow-origin')
    if (corsHeader) {
      console.log('   ✅ CORS configured:', corsHeader)
    } else {
      console.log('   ⚠️  CORS header not found (may still work)')
    }
  } catch (error) {
    console.log('   ⚠️  CORS test error:', error.message)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  if (allTestsPassed) {
    console.log('✅ All tests passed!')
    console.log('\n🌐 Next steps:')
    console.log('   1. Setup Netlify VITE_API_URL:', RAILWAY_URL)
    console.log('   2. Run: node scripts/setup-netlify-env.js', RAILWAY_URL)
    console.log('   3. Test frontend: https://leafy-sunflower-6cf24d.netlify.app')
  } else {
    console.log('❌ Some tests failed')
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check Railway Settings > Deploy > Start Command = "npm run server"')
    console.log('   2. Check Railway logs to see if server is running')
    console.log('   3. Verify Environment Variables are set correctly')
    console.log('   4. Redeploy Railway project')
  }
  console.log('='.repeat(60))
}

testRailway().catch((error) => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})

