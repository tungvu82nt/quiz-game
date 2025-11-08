# ✅ Deployment Checklist

## Trước khi Deploy

- [ ] Code đã push lên GitHub: `tungvu82nt/quiz-game`
- [ ] Backend server chạy được local: `npm run server`
- [ ] Database migration đã chạy: `npm run db:migrate`
- [ ] Test API local: `node scripts/test-api.js http://localhost:3002`

## Deploy Backend API Server

Chọn một trong các platform:

### Option 1: Railway (Khuyến nghị)

- [ ] Đăng ký Railway: https://railway.app
- [ ] Deploy from GitHub: Chọn repository `tungvu82nt/quiz-game`
- [ ] Set Environment Variables:
  - [ ] `DATABASE_URL` = `postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
  - [ ] `PORT` = `3002`
  - [ ] `ALLOWED_ORIGINS` = `https://leafy-sunflower-6cf24d.netlify.app`
  - [ ] `NODE_ENV` = `production`
- [ ] Set Build Command: `npm install && npm run db:migrate`
- [ ] Set Start Command: `npm run server`
- [ ] Lấy Backend URL từ Railway dashboard
- [ ] Test Backend API: `node scripts/test-api.js <backend-url>`

### Option 2: Render

- [ ] Đăng ký Render: https://render.com
- [ ] Tạo Web Service: Connect repository `tungvu82nt/quiz-game`
- [ ] Cấu hình Service:
  - [ ] Name: `quiz-api`
  - [ ] Region: `Singapore`
  - [ ] Runtime: `Node`
  - [ ] Build Command: `npm install && npm run db:migrate`
  - [ ] Start Command: `npm run server`
- [ ] Set Environment Variables:
  - [ ] `DATABASE_URL` = `postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
  - [ ] `PORT` = `10000`
  - [ ] `ALLOWED_ORIGINS` = `https://leafy-sunflower-6cf24d.netlify.app`
  - [ ] `NODE_ENV` = `production`
- [ ] Lấy Backend URL từ Render dashboard
- [ ] Test Backend API: `node scripts/test-api.js <backend-url>`

### Option 3: Fly.io

- [ ] Cài đặt Fly CLI: `iwr https://fly.io/install.ps1 -useb | iex` (Windows)
- [ ] Đăng nhập: `fly auth login`
- [ ] Deploy: `fly launch` (trong thư mục quiz-game)
- [ ] Set Secrets:
  - [ ] `fly secrets set DATABASE_URL="postgresql://..."`
  - [ ] `fly secrets set ALLOWED_ORIGINS="https://leafy-sunflower-6cf24d.netlify.app"`
  - [ ] `fly secrets set NODE_ENV="production"`
  - [ ] `fly secrets set PORT="8080"`
- [ ] Deploy: `fly deploy`
- [ ] Lấy Backend URL: `fly open`
- [ ] Test Backend API: `node scripts/test-api.js <backend-url>`

## Setup Netlify Environment Variables

Sau khi có Backend URL:

### Cách 1: Tự động (Khuyến nghị)

- [ ] Chạy script: `node scripts/setup-netlify-env.js <backend-url>`
- [ ] Đợi Netlify deploy xong (1-2 phút)
- [ ] Test lại: https://leafy-sunflower-6cf24d.netlify.app

### Cách 2: Thủ công

- [ ] Đăng nhập Netlify: https://app.netlify.com
- [ ] Chọn site: `leafy-sunflower-6cf24d`
- [ ] Vào **Site settings** > **Environment variables**
- [ ] Set các biến:
  - [ ] `VITE_API_URL` = `<backend-url>`
  - [ ] `VITE_ANALYSIS_API_URL` = `https://api.minimax.chat/v1/`
  - [ ] `VITE_ANALYSIS_API_KEY` = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`
  - [ ] `VITE_ANALYSIS_API_PATH` = `chat/completions`
  - [ ] `VITE_ANALYSIS_MODEL` = `MiniMax-M2`
  - [ ] `VITE_PROMPT_STYLE` = `narrative`
  - [ ] `VITE_ANALYSIS_USE_MOCK` = `1`
- [ ] Trigger deploy: **Deploys** > **Trigger deploy** > **Clear cache and deploy site**

## Test Deployment

- [ ] Test Backend API: `node scripts/test-api.js <backend-url>`
- [ ] Test Frontend: https://leafy-sunflower-6cf24d.netlify.app
- [ ] Mở Developer Console (F12)
- [ ] Kiểm tra Console logs:
  - [ ] Không có lỗi CORS
  - [ ] API calls trả về JSON
  - [ ] Response Status: 200
  - [ ] Content-Type: application/json
- [ ] Test chức năng:
  - [ ] Chơi quiz
  - [ ] Submit score
  - [ ] Xem leaderboard
  - [ ] GPS tracking hoạt động

## Troubleshooting

Nếu gặp lỗi:

- [ ] Kiểm tra Backend logs trên platform (Railway/Render/Fly.io)
- [ ] Kiểm tra Netlify build logs
- [ ] Kiểm tra Database connection
- [ ] Kiểm tra CORS configuration
- [ ] Kiểm tra Environment Variables

## Quick Commands

```bash
# Test backend local
npm run server
node scripts/test-api.js http://localhost:3002

# Test backend deployed
node scripts/test-api.js <backend-url>

# Setup Netlify automatically
node scripts/setup-netlify-env.js <backend-url>

# Check deployment status
node scripts/check-deployment.js

# Database migration
npm run db:migrate

# Check database
npm run db:check
```

## Tài liệu tham khảo

- `DEPLOYMENT_GUIDE.md`: Hướng dẫn chi tiết deploy
- `NETLIFY_AUTO_SETUP.md`: Hướng dẫn setup Netlify tự động
- `NETLIFY_ENV_SETUP.md`: Hướng dẫn setup Netlify thủ công
- `scripts/deploy-backend.js`: Script hỗ trợ deploy

---

**Lưu ý:** Đảm bảo tất cả các bước đã hoàn thành trước khi test production!

