#!/usr/bin/env node

/**
 * Script hỗ trợ deploy backend API server
 * Hướng dẫn user qua các bước deploy và test
 * 
 * Usage: node scripts/deploy-backend.js
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
  console.log('🚀 Hướng dẫn Deploy Backend API Server\n')
  console.log('=' .repeat(60))
  
  console.log('\n📋 Checklist trước khi deploy:')
  console.log('   ✅ Code đã push lên GitHub: tungvu82nt/quiz-game')
  console.log('   ✅ DATABASE_URL đã có trong .env')
  console.log('   ✅ Backend server chạy được local\n')
  
  // Kiểm tra backend local
  console.log('🔍 Kiểm tra backend local...')
  try {
    const response = await fetch('http://localhost:3002/health')
    if (response.ok) {
      console.log('   ✅ Backend đang chạy tại http://localhost:3002\n')
    } else {
      console.log('   ⚠️  Backend không phản hồi tại http://localhost:3002')
      console.log('   💡 Chạy: npm run server\n')
    }
  } catch (error) {
    console.log('   ⚠️  Backend không chạy local')
    console.log('   💡 Chạy: npm run server\n')
  }
  
  console.log('📦 Chọn platform để deploy:\n')
  console.log('   1. Railway (Khuyến nghị - dễ sử dụng)')
  console.log('   2. Render (Miễn phí, dễ cấu hình)')
  console.log('   3. Fly.io (Nhanh, global)')
  console.log('   4. Đã deploy xong, chỉ cần setup Netlify\n')
  
  const choice = await question('Chọn option (1-4): ')
  
  switch (choice.trim()) {
    case '1':
      console.log('\n🚂 Hướng dẫn deploy lên Railway:\n')
      console.log('1. Truy cập: https://railway.app')
      console.log('2. Đăng nhập bằng GitHub')
      console.log('3. Click "New Project" > "Deploy from GitHub repo"')
      console.log('4. Chọn repository: tungvu82nt/quiz-game')
      console.log('5. Vào Variables tab, thêm:')
      console.log('   DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
      console.log('   PORT=3002')
      console.log('   ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app')
      console.log('   NODE_ENV=production')
      console.log('6. Vào Settings > Build Command: npm install && npm run db:migrate')
      console.log('7. Vào Settings > Start Command: npm run server')
      console.log('8. Đợi deploy xong, lấy URL từ Settings > Domains\n')
      break
      
    case '2':
      console.log('\n🎨 Hướng dẫn deploy lên Render:\n')
      console.log('1. Truy cập: https://render.com')
      console.log('2. Đăng nhập bằng GitHub')
      console.log('3. Click "New +" > "Web Service"')
      console.log('4. Connect repository: tungvu82nt/quiz-game')
      console.log('5. Cấu hình:')
      console.log('   Name: quiz-api')
      console.log('   Region: Singapore')
      console.log('   Branch: main')
      console.log('   Runtime: Node')
      console.log('   Build Command: npm install && npm run db:migrate')
      console.log('   Start Command: npm run server')
      console.log('6. Vào Environment tab, thêm:')
      console.log('   DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
      console.log('   PORT=10000')
      console.log('   ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app')
      console.log('   NODE_ENV=production')
      console.log('7. Click "Create Web Service"')
      console.log('8. Đợi deploy xong, lấy URL từ dashboard\n')
      break
      
    case '3':
      console.log('\n✈️  Hướng dẫn deploy lên Fly.io:\n')
      console.log('1. Cài đặt Fly CLI:')
      console.log('   Windows: iwr https://fly.io/install.ps1 -useb | iex')
      console.log('   macOS/Linux: curl -L https://fly.io/install.sh | sh')
      console.log('2. Đăng nhập: fly auth login')
      console.log('3. Deploy: fly launch (trong thư mục quiz-game)')
      console.log('4. Set secrets:')
      console.log('   fly secrets set DATABASE_URL="postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"')
      console.log('   fly secrets set ALLOWED_ORIGINS="https://leafy-sunflower-6cf24d.netlify.app"')
      console.log('   fly secrets set NODE_ENV="production"')
      console.log('   fly secrets set PORT="8080"')
      console.log('5. Deploy: fly deploy')
      console.log('6. Lấy URL: fly open\n')
      break
      
    case '4':
      const backendUrl = await question('\n📝 Nhập Backend API URL (ví dụ: https://quiz-api.onrender.com): ')
      
      if (!backendUrl || !backendUrl.startsWith('http')) {
        console.log('❌ URL không hợp lệ')
        rl.close()
        return
      }
      
      console.log(`\n🧪 Testing backend API: ${backendUrl}`)
      
      try {
        const testResponse = await fetch(`${backendUrl}/health`)
        if (testResponse.ok) {
          const data = await testResponse.json()
          console.log(`   ✅ Backend hoạt động: ${JSON.stringify(data)}`)
        } else {
          console.log(`   ❌ Backend không phản hồi đúng: ${testResponse.status}`)
        }
      } catch (error) {
        console.log(`   ❌ Không thể kết nối đến backend: ${error.message}`)
        console.log('   💡 Đảm bảo backend đã deploy xong và đang chạy')
      }
      
      console.log('\n🔧 Setup Netlify Environment Variables...')
      console.log('   Chạy lệnh sau để tự động setup:')
      console.log(`   node scripts/setup-netlify-env.js ${backendUrl}\n`)
      
      const autoSetup = await question('Bạn có muốn tự động setup Netlify ngay bây giờ? (y/n): ')
      
      if (autoSetup.trim().toLowerCase() === 'y') {
        console.log('\n🚀 Đang setup Netlify...')
        const { execSync } = require('child_process')
        try {
          execSync(`node scripts/setup-netlify-env.js ${backendUrl}`, { stdio: 'inherit' })
          console.log('\n✅ Setup hoàn tất!')
          console.log('   Đợi 1-2 phút để Netlify deploy xong')
          console.log('   Sau đó test lại: https://leafy-sunflower-6cf24d.netlify.app\n')
        } catch (error) {
          console.log('\n❌ Lỗi khi setup Netlify:', error.message)
          console.log('   💡 Kiểm tra NETLIFY_API_TOKEN trong .env\n')
        }
      }
      
      break
      
    default:
      console.log('\n❌ Lựa chọn không hợp lệ')
  }
  
  console.log('\n📚 Tài liệu tham khảo:')
  console.log('   - DEPLOYMENT_GUIDE.md: Hướng dẫn chi tiết')
  console.log('   - NETLIFY_AUTO_SETUP.md: Hướng dẫn setup Netlify')
  console.log('   - scripts/test-api.js: Test API endpoint\n')
  
  rl.close()
}

main().catch((error) => {
  console.error('❌ Error:', error)
  rl.close()
  process.exit(1)
})

