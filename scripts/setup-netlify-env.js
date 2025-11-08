#!/usr/bin/env node

/**
 * Script để tự động cấu hình Netlify Environment Variables
 * Sử dụng Netlify API để set environment variables
 * 
 * Usage: 
 *   node scripts/setup-netlify-env.js <backend-api-url>
 *   NETLIFY_API_TOKEN=xxx node scripts/setup-netlify-env.js <backend-api-url>
 * 
 * Example:
 *   NETLIFY_API_TOKEN=nfp_xxx node scripts/setup-netlify-env.js https://quiz-api.onrender.com
 */

const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN || process.env.API_NETLIFY
const SITE_ID = 'leafy-sunflower-6cf24d'
const BACKEND_API_URL = process.argv[2] || process.env.BACKEND_API_URL

if (!NETLIFY_API_TOKEN) {
  console.error('❌ Error: NETLIFY_API_TOKEN is required')
  console.error('   Set NETLIFY_API_TOKEN environment variable or use API_NETLIFY')
  process.exit(1)
}

if (!BACKEND_API_URL) {
  console.error('❌ Error: Backend API URL is required')
  console.error('   Usage: node scripts/setup-netlify-env.js <backend-api-url>')
  process.exit(1)
}

const NETLIFY_API = 'https://api.netlify.com/api/v1'

async function setupNetlifyEnv() {
  console.log('🚀 Setting up Netlify Environment Variables...\n')
  console.log(`Site ID: ${SITE_ID}`)
  console.log(`Backend API URL: ${BACKEND_API_URL}\n`)

  // Environment variables to set
  const envVars = {
    VITE_API_URL: BACKEND_API_URL,
    VITE_ANALYSIS_API_URL: 'https://api.minimax.chat/v1/',
    VITE_ANALYSIS_API_KEY: process.env.VITE_ANALYSIS_API_KEY || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJrZWx2aW5sZWUiLCJVc2VyTmFtZSI6ImtlbHZpbmxlZSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg1NzU1OTAzNzU1ODIxOTA4IiwiUGhvbmUiOiIxMzE1MDYyNjk2OCIsIkdyb3VwSUQiOiIxOTg1NzU1OTAzNzQ3NDMzMzAwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMTEtMDYgMDM6MTQ6NTMiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.XngHDNeZ9bl-WvD9nfEMF-JGiLUXS3K_zoIql_MQ332ziFuGOZV6QktHsocZOvn4WjaqyzYFXIl5_fPc8ZBrj78f4ebd7v_yMDiIOJWPm7GvyIp8XZeajJRqQ7A-_PLt1MGBDbs4uNjkpFgEuUn76NkgGz4IZJHmMF1fLbdEpvvERROSDhi39Ca-Ozv1IxgnjCQDsX7uipvJsXQlCsz0zl61vmV-S0RxAnjdSmZTjBMuZNxYgoijmZidQVQhIRh2BuLbTHxgtQvTcus6K7wdXzHQb2dbJ1Q7mvOcBW4Z7KXumgID1RQR76nVTLKaEgLOfqAFEcqyXYq_8OWkGVqcUQ',
    VITE_ANALYSIS_API_PATH: 'chat/completions',
    VITE_ANALYSIS_MODEL: 'MiniMax-M2',
    VITE_PROMPT_STYLE: 'narrative',
    VITE_ANALYSIS_USE_MOCK: '1',
  }

  try {
    // Get current site info
    console.log('📡 Getting site information...')
    const siteResponse = await fetch(`${NETLIFY_API}/sites/${SITE_ID}`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!siteResponse.ok) {
      const error = await siteResponse.text()
      throw new Error(`Failed to get site info: ${siteResponse.status} ${error}`)
    }

    const site = await siteResponse.json()
    console.log(`✅ Site found: ${site.name} (${site.url})\n`)

    // Set environment variables
    console.log('🔧 Setting environment variables...')
    for (const [key, value] of Object.entries(envVars)) {
      try {
        const envResponse = await fetch(`${NETLIFY_API}/sites/${SITE_ID}/env`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            values: [
              {
                value,
                context: 'all', // all, dev, branch-deploy, deploy-preview, production
              },
            ],
          }),
        })

        if (!envResponse.ok) {
          const error = await envResponse.text()
          console.error(`   ❌ Failed to set ${key}: ${error}`)
        } else {
          console.log(`   ✅ Set ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`)
        }
      } catch (error) {
        console.error(`   ❌ Error setting ${key}:`, error.message)
      }
    }

    console.log('\n🚀 Triggering new deployment...')
    
    // Trigger new deployment
    const deployResponse = await fetch(`${NETLIFY_API}/sites/${SITE_ID}/builds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear_cache: true,
      }),
    })

    if (!deployResponse.ok) {
      const error = await deployResponse.text()
      console.error(`   ❌ Failed to trigger deployment: ${error}`)
    } else {
      const deploy = await deployResponse.json()
      console.log(`   ✅ Deployment triggered: ${deploy.id}`)
      console.log(`   📋 Deploy URL: https://app.netlify.com/sites/${SITE_ID}/deploys/${deploy.id}`)
    }

    console.log('\n✅ Setup completed!')
    console.log(`\n🌐 Site URL: https://${SITE_ID}.netlify.app`)
    console.log(`📋 Monitor deployment: https://app.netlify.com/sites/${SITE_ID}/deploys`)
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

setupNetlifyEnv()

