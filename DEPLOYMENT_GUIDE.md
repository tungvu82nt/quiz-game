# Hướng dẫn Deploy Backend API Server

## Tổng quan

Backend API server cần được deploy trên một platform khác vì Netlify chỉ hỗ trợ static sites. Các platform được khuyến nghị:
- **Railway** (Khuyến nghị - dễ sử dụng)
- **Render** (Miễn phí, dễ cấu hình)
- **Fly.io** (Nhanh, global)

---

## Option 1: Deploy lên Railway (Khuyến nghị)

### Bước 1: Đăng ký Railway
1. Truy cập https://railway.app
2. Đăng nhập bằng GitHub account
3. Click **"New Project"**

### Bước 2: Deploy từ GitHub
1. Chọn **"Deploy from GitHub repo"**
2. Chọn repository: `tungvu82nt/quiz-game`
3. Railway sẽ tự động detect và deploy

### Bước 3: Cấu hình Environment Variables
1. Vào **Variables** tab trong Railway project
2. Thêm các biến sau:

```
DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3002
ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
NODE_ENV=production
```

### Bước 4: Cấu hình Build & Start Command
1. Vào **Settings** tab
2. **Build Command**: `npm install && npm run db:migrate`
3. **Start Command**: `npm run server`

### Bước 5: Lấy URL
1. Railway sẽ tự động tạo domain cho bạn
2. Vào **Settings** > **Domains** để xem URL
3. URL sẽ có dạng: `https://quiz-api-production-xxxx.up.railway.app`

### Bước 6: Test API
```bash
curl https://your-railway-url.up.railway.app/health
# Should return: {"status":"ok","message":"API server is running"}
```

---

## Option 2: Deploy lên Render

### Bước 1: Đăng ký Render
1. Truy cập https://render.com
2. Đăng nhập bằng GitHub account

### Bước 2: Tạo Web Service
1. Click **"New +"** > **"Web Service"**
2. Connect repository: `tungvu82nt/quiz-game`
3. Chọn branch: `main`

### Bước 3: Cấu hình Service
- **Name**: `quiz-api`
- **Region**: Singapore (hoặc gần nhất)
- **Branch**: `main`
- **Root Directory**: (để trống)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run db:migrate`
- **Start Command**: `npm run server`

### Bước 4: Cấu hình Environment Variables
Thêm các biến trong **Environment** tab:

```
DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=10000
ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
NODE_ENV=production
```

**Lưu ý:** Render sử dụng port `10000` mặc định, không cần set PORT nếu dùng port này.

### Bước 5: Deploy
1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. URL sẽ có dạng: `https://quiz-api.onrender.com`

### Bước 6: Test API
```bash
curl https://quiz-api.onrender.com/health
# Should return: {"status":"ok","message":"API server is running"}
```

---

## Option 3: Deploy lên Fly.io

### Bước 1: Cài đặt Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

### Bước 2: Đăng nhập
```bash
fly auth login
```

### Bước 3: Deploy
```bash
# Trong thư mục quiz-game
fly launch
```

### Bước 4: Cấu hình Secrets
```bash
fly secrets set DATABASE_URL="postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
fly secrets set ALLOWED_ORIGINS="https://leafy-sunflower-6cf24d.netlify.app"
fly secrets set NODE_ENV="production"
fly secrets set PORT="8080"
```

### Bước 5: Deploy
```bash
fly deploy
```

### Bước 6: Test API
```bash
fly open
# Hoặc test trực tiếp
curl https://your-app.fly.dev/health
```

---

## Sau khi Deploy Backend

### Bước 1: Lấy Backend API URL
- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`
- Fly.io: `https://your-app.fly.dev`

### Bước 2: Cấu hình Netlify Dashboard

1. Đăng nhập vào [Netlify Dashboard](https://app.netlify.com)
2. Chọn site: `leafy-sunflower-6cf24d`
3. Vào **Site settings** > **Environment variables**
4. Thêm/sửa biến `VITE_API_URL`:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api-url.com` (URL từ bước 1)
5. Click **Save**
6. Vào **Deploys** tab và click **Trigger deploy** > **Clear cache and deploy site**

### Bước 3: Test lại

1. Mở Netlify URL: `https://leafy-sunflower-6cf24d.netlify.app`
2. Mở Developer Console (F12)
3. Kiểm tra Console logs:
   - Should see: "Response Status: 200"
   - Should see: "Content-Type: application/json"
   - Should see: "Successfully fetched leaderboard: X items"
4. Kiểm tra Network tab:
   - Request đến backend API phải trả về JSON
   - Status code phải là 200
   - Content-Type phải là `application/json`

---

## Troubleshooting

### Lỗi: Database connection failed
- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo Neon PostgreSQL database đang hoạt động
- Kiểm tra network connectivity từ platform đến database

### Lỗi: CORS policy error
- Kiểm tra `ALLOWED_ORIGINS` có chứa Netlify URL không
- Đảm bảo format đúng: `https://leafy-sunflower-6cf24d.netlify.app`

### Lỗi: Port already in use
- Railway: Không cần set PORT (Railway tự động assign)
- Render: Sử dụng port `10000` (mặc định)
- Fly.io: Sử dụng port `8080` (theo fly.toml)

### Lỗi: Migration failed
- Kiểm tra database connection
- Chạy migration thủ công: `npm run db:migrate`
- Kiểm tra logs trên platform để xem lỗi chi tiết

---

## Environment Variables Summary

### Backend (Railway/Render/Fly.io)
```
DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3002 (Railway/Fly.io) hoặc 10000 (Render)
ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
NODE_ENV=production
```

### Frontend (Netlify Dashboard)
```
VITE_API_URL=https://your-backend-api-url.com
VITE_ANALYSIS_API_URL=https://api.minimax.chat/v1/
VITE_ANALYSIS_API_KEY=your_api_key
VITE_ANALYSIS_API_PATH=chat/completions
VITE_ANALYSIS_MODEL=MiniMax-M2
VITE_PROMPT_STYLE=narrative
VITE_ANALYSIS_USE_MOCK=1
```

---

## Quick Start (Railway - Khuyến nghị)

1. Đăng ký Railway: https://railway.app
2. Deploy from GitHub: Chọn repository `tungvu82nt/quiz-game`
3. Set environment variables (xem trên)
4. Lấy URL từ Railway dashboard
5. Set `VITE_API_URL` trong Netlify Dashboard
6. Redeploy Netlify site
7. Test lại!

Good luck! 🚀

