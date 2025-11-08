#!/usr/bin/env node

/**
 * Script để test API endpoint sau khi deploy
 * Usage: node scripts/test-api.js <api-url>
 * Example: node scripts/test-api.js https://quiz-api.onrender.com
 */

const API_URL = process.argv[2] || process.env.API_URL || 'http://localhost:3002'

async function testAPI() {
  console.log(`🧪 Testing API: ${API_URL}\n`)

  // Test 1: Health check
  console.log('1. Testing /health endpoint...')
  try {
    const healthResponse = await fetch(`${API_URL}/health`)
    const healthData = await healthResponse.json()
    if (healthResponse.ok && healthData.status === 'ok') {
      console.log('   ✅ Health check passed:', healthData)
    } else {
      console.log('   ❌ Health check failed:', healthData)
      return false
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message)
    return false
  }

  // Test 2: GET /api/leaderboard
  console.log('\n2. Testing GET /api/leaderboard...')
  try {
    const leaderboardResponse = await fetch(`${API_URL}/api/leaderboard`)
    const contentType = leaderboardResponse.headers.get('content-type')
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log('   ❌ Invalid Content-Type:', contentType)
      const text = await leaderboardResponse.text()
      console.log('   Response preview:', text.substring(0, 200))
      return false
    }

    const leaderboardData = await leaderboardResponse.json()
    if (leaderboardResponse.ok && Array.isArray(leaderboardData)) {
      console.log(`   ✅ Leaderboard fetched: ${leaderboardData.length} items`)
    } else {
      console.log('   ❌ Leaderboard fetch failed:', leaderboardData)
      return false
    }
  } catch (error) {
    console.log('   ❌ Leaderboard fetch error:', error.message)
    return false
  }

  // Test 3: POST /api/leaderboard
  console.log('\n3. Testing POST /api/leaderboard...')
  try {
    const testItem = {
      name: 'Test User',
      score: 10,
      summary: 'Test summary',
      timestamp: Date.now(),
    }

    const postResponse = await fetch(`${API_URL}/api/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testItem),
    })

    const contentType = postResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.log('   ❌ Invalid Content-Type:', contentType)
      const text = await postResponse.text()
      console.log('   Response preview:', text.substring(0, 200))
      return false
    }

    const postData = await postResponse.json()
    if (postResponse.ok && postData.name === testItem.name) {
      console.log('   ✅ Item added successfully:', postData.name)
    } else {
      console.log('   ❌ Item add failed:', postData)
      return false
    }
  } catch (error) {
    console.log('   ❌ Item add error:', error.message)
    return false
  }

  // Test 4: CORS headers
  console.log('\n4. Testing CORS headers...')
  try {
    const corsResponse = await fetch(`${API_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://leafy-sunflower-6cf24d.netlify.app',
      },
    })
    const corsHeader = corsResponse.headers.get('access-control-allow-origin')
    if (corsHeader) {
      console.log('   ✅ CORS configured:', corsHeader)
    } else {
      console.log('   ⚠️  CORS header not found (may still work)')
    }
  } catch (error) {
    console.log('   ⚠️  CORS test error:', error.message)
  }

  console.log('\n✅ All tests passed!')
  return true
}

testAPI().then((success) => {
  process.exit(success ? 0 : 1)
}).catch((error) => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})

