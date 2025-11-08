#!/usr/bin/env node

/**
 * Script để kiểm tra deployment sau khi setup
 * Kiểm tra Netlify site và backend API
 * 
 * Usage:
 *   node scripts/check-deployment.js <backend-api-url>
 *   BACKEND_API_URL=https://... node scripts/check-deployment.js
 */

const BACKEND_API_URL = process.argv[2] || process.env.BACKEND_API_URL
const NETLIFY_SITE = 'https://leafy-sunflower-6cf24d.netlify.app'

if (!BACKEND_API_URL) {
  console.error('❌ Error: Backend API URL is required')
  console.error('   Usage: node scripts/check-deployment.js <backend-api-url>')
  process.exit(1)
}

async function checkDeployment() {
  console.log('🔍 Checking deployment status...\n')
  console.log(`Netlify Site: ${NETLIFY_SITE}`)
  console.log(`Backend API: ${BACKEND_API_URL}\n`)

  let allPassed = true

  // Test 1: Backend API Health
  console.log('1. Testing Backend API Health...')
  try {
    const healthResponse = await fetch(`${BACKEND_API_URL}/health`)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('   ✅ Backend API is running:', healthData)
    } else {
      console.log('   ❌ Backend API health check failed:', healthResponse.status)
      allPassed = false
    }
  } catch (error) {
    console.log('   ❌ Backend API not accessible:', error.message)
    allPassed = false
  }

  // Test 2: Backend API Leaderboard
  console.log('\n2. Testing Backend API Leaderboard...')
  try {
    const leaderboardResponse = await fetch(`${BACKEND_API_URL}/api/leaderboard`)
    const contentType = leaderboardResponse.headers.get('content-type')
    
    if (leaderboardResponse.ok && contentType && contentType.includes('application/json')) {
      const data = await leaderboardResponse.json()
      console.log(`   ✅ Leaderboard API working: ${data.length} items`)
    } else {
      console.log('   ❌ Leaderboard API failed:', leaderboardResponse.status, contentType)
      allPassed = false
    }
  } catch (error) {
    console.log('   ❌ Leaderboard API error:', error.message)
    allPassed = false
  }

  // Test 3: Netlify Site
  console.log('\n3. Testing Netlify Site...')
  try {
    const siteResponse = await fetch(NETLIFY_SITE)
    if (siteResponse.ok) {
      console.log('   ✅ Netlify site is accessible')
    } else {
      console.log('   ❌ Netlify site error:', siteResponse.status)
      allPassed = false
    }
  } catch (error) {
    console.log('   ❌ Netlify site not accessible:', error.message)
    allPassed = false
  }

  // Test 4: Frontend API Call (check if VITE_API_URL is configured)
  console.log('\n4. Testing Frontend API Configuration...')
  try {
    // Check if frontend is calling the correct backend
    const frontendResponse = await fetch(NETLIFY_SITE)
    const html = await frontendResponse.text()
    
    // Check if the built JS contains the backend URL
    // This is a simple check - in reality, we'd need to check the built assets
    console.log('   ℹ️  Frontend build detected')
    console.log('   ⚠️  Note: VITE_API_URL is injected at build time')
    console.log('   💡 Check browser console to verify API calls')
  } catch (error) {
    console.log('   ❌ Error checking frontend:', error.message)
    allPassed = false
  }

  // Test 5: CORS Check
  console.log('\n5. Testing CORS Configuration...')
  try {
    const corsResponse = await fetch(`${BACKEND_API_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': NETLIFY_SITE,
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

  // Summary
  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('✅ All checks passed!')
    console.log('\n🌐 Next steps:')
    console.log('   1. Open browser: https://leafy-sunflower-6cf24d.netlify.app')
    console.log('   2. Open Developer Console (F12)')
    console.log('   3. Check Network tab for API calls')
    console.log('   4. Verify leaderboard loads correctly')
  } else {
    console.log('❌ Some checks failed')
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check backend API is running and accessible')
    console.log('   2. Verify VITE_API_URL is set in Netlify Dashboard')
    console.log('   3. Check CORS configuration in backend')
    console.log('   4. Redeploy Netlify site after setting env vars')
  }
  console.log('='.repeat(50))
}

checkDeployment().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

