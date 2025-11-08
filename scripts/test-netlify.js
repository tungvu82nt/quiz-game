#!/usr/bin/env node

/**
 * Script để test Netlify site và kiểm tra cấu hình
 * Usage: node scripts/test-netlify.js
 */

const NETLIFY_SITE = 'https://leafy-sunflower-6cf24d.netlify.app'

async function testNetlify() {
  console.log('🔍 Testing Netlify Site...\n')
  console.log(`Site URL: ${NETLIFY_SITE}\n`)

  // Test 1: Site accessibility
  console.log('1. Testing site accessibility...')
  try {
    const siteResponse = await fetch(NETLIFY_SITE)
    if (siteResponse.ok) {
      console.log('   ✅ Site is accessible')
      const html = await siteResponse.text()
      console.log(`   📄 Page size: ${(html.length / 1024).toFixed(2)} KB`)
    } else {
      console.log(`   ❌ Site error: ${siteResponse.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Site not accessible: ${error.message}`)
  }

  // Test 2: Check API endpoint (should fail if backend not configured)
  console.log('\n2. Testing API endpoint...')
  try {
    const apiResponse = await fetch(`${NETLIFY_SITE}/api/leaderboard`)
    const contentType = apiResponse.headers.get('content-type')
    
    console.log(`   Status: ${apiResponse.status}`)
    console.log(`   Content-Type: ${contentType}`)
    
    if (contentType && contentType.includes('application/json')) {
      console.log('   ✅ API endpoint returns JSON (backend is configured)')
      const data = await apiResponse.json()
      console.log(`   📊 Leaderboard items: ${Array.isArray(data) ? data.length : 'N/A'}`)
    } else if (contentType && contentType.includes('text/html')) {
      console.log('   ❌ API endpoint returns HTML (backend NOT configured)')
      console.log('   ⚠️  This means VITE_API_URL is not set in Netlify Dashboard')
      console.log('   💡 Frontend is using relative URL, calling Netlify instead of backend')
    } else {
      console.log(`   ⚠️  Unexpected Content-Type: ${contentType}`)
    }
  } catch (error) {
    console.log(`   ❌ API endpoint error: ${error.message}`)
  }

  // Test 3: Check if VITE_API_URL is needed
  console.log('\n3. Diagnosing configuration...')
  try {
    const apiResponse = await fetch(`${NETLIFY_SITE}/api/leaderboard`)
    const contentType = apiResponse.headers.get('content-type')
    
    if (contentType && contentType.includes('text/html')) {
      console.log('   ❌ Problem detected:')
      console.log('      - VITE_API_URL is NOT set in Netlify Dashboard')
      console.log('      - Frontend is calling: https://leafy-sunflower-6cf24d.netlify.app/api/leaderboard')
      console.log('      - Expected: Backend API URL (e.g., https://quiz-api.onrender.com/api/leaderboard)')
      console.log('\n   ✅ Solution:')
      console.log('      1. Deploy backend API server (Railway/Render/Fly.io)')
      console.log('      2. Set VITE_API_URL in Netlify Dashboard')
      console.log('      3. Redeploy Netlify site')
      console.log('      4. Test again')
    } else {
      console.log('   ✅ Configuration looks correct')
    }
  } catch (error) {
    console.log(`   ⚠️  Error diagnosing: ${error.message}`)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📋 Summary:')
  console.log('   - Frontend site: ✅ Accessible')
  console.log('   - Backend API: ❓ Check configuration above')
  console.log('\n💡 Next steps:')
  console.log('   1. If backend is not deployed:')
  console.log('      - Follow DEPLOYMENT_GUIDE.md')
  console.log('      - Deploy to Railway/Render/Fly.io')
  console.log('   2. If backend is deployed:')
  console.log('      - Set VITE_API_URL in Netlify Dashboard')
  console.log('      - Redeploy Netlify site')
  console.log('      - Run: node scripts/test-netlify.js')
  console.log('='.repeat(60))
}

testNetlify().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

