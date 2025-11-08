# Quick Start Guide - Deploy Quiz Game

## Tổng quan

Hướng dẫn nhanh để deploy ứng dụng Quiz Game lên Netlify (frontend) và Railway/Render (backend).

---

## Bước 1: Deploy Backend API Server

### Option A: Railway (Khuyến nghị - Dễ nhất)

1. **Đăng ký Railway**
   - Truy cập: https://railway.app
   - Đăng nhập bằng GitHub

2. **Deploy từ GitHub**
   - Click **"New Project"**
   - Chọn **"Deploy from GitHub repo"**
   - Chọn repository: `tungvu82nt/quiz-game`
   - Railway sẽ tự động detect và deploy

3. **Cấu hình Environment Variables**
   - Vào **Variables** tab
   - Thêm các biến sau:
     ```
     DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     PORT=3002
     ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
     NODE_ENV=production
     ```

4. **Lấy Backend URL**
   - Railway sẽ tự động tạo URL
   - Vào **Settings** > **Domains** để xem
   - URL format: `https://quiz-api-production-xxxx.up.railway.app`

5. **Test Backend**
   ```bash
   curl https://your-railway-url.up.railway.app/health
   # Should return: {"status":"ok","message":"API server is running"}
   ```

### Option B: Render (Miễn phí)

1. **Đăng ký Render**
   - Truy cập: https://render.com
   - Đăng nhập bằng GitHub

2. **Tạo Web Service**
   - Click **"New +"** > **"Web Service"**
   - Connect repository: `tungvu82nt/quiz-game`
   - Branch: `main`

3. **Cấu hình Service**
   - **Name**: `quiz-api`
   - **Region**: Singapore
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run db:migrate`
   - **Start Command**: `npm run server`

4. **Environment Variables**
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   PORT=10000
   ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
   NODE_ENV=production
   ```

5. **Lấy Backend URL**
   - Render sẽ tự động tạo URL
   - URL format: `https://quiz-api.onrender.com`

---

## Bước 2: Setup Netlify Environment Variables

### Cách 1: Sử dụng Script Tự động (Khuyến nghị)

```bash
# Windows PowerShell
$env:API_NETLIFY="nfp_TrrRjnf9GdweZEYHCDrMFFijAeFJUK9B3423"
node scripts/setup-netlify-env.js https://your-backend-api-url.com

# Example với Railway
node scripts/setup-netlify-env.js https://quiz-api-production-xxxx.up.railway.app

# Example với Render
node scripts/setup-netlify-env.js https://quiz-api.onrender.com
```

Script sẽ tự động:
- ✅ Set tất cả environment variables
- ✅ Trigger new deployment
- ✅ Clear cache

### Cách 2: Manual Setup (Netlify Dashboard)

1. **Đăng nhập Netlify**
   - Truy cập: https://app.netlify.com
   - Chọn site: `leafy-sunflower-6cf24d`

2. **Vào Environment Variables**
   - **Site settings** > **Environment variables**
   - Click **"Add a variable"**

3. **Thêm các biến:**
   - `VITE_API_URL` = `https://your-backend-api-url.com`
   - `VITE_ANALYSIS_API_URL` = `https://api.minimax.chat/v1/`
   - `VITE_ANALYSIS_API_KEY` = (từ .env)
   - `VITE_ANALYSIS_API_PATH` = `chat/completions`
   - `VITE_ANALYSIS_MODEL` = `MiniMax-M2`
   - `VITE_PROMPT_STYLE` = `narrative`
   - `VITE_ANALYSIS_USE_MOCK` = `1`

4. **Redeploy**
   - Vào **Deploys** tab
   - Click **"Trigger deploy"** > **"Clear cache and deploy site"**

---

## Bước 3: Kiểm tra Deployment

### Sử dụng Script
```bash
node scripts/check-deployment.js https://your-backend-api-url.com
```

### Kiểm tra thủ công

1. **Test Backend API**
   ```bash
   curl https://your-backend-api-url.com/health
   curl https://your-backend-api-url.com/api/leaderboard
   ```

2. **Test Frontend**
   - Mở: https://leafy-sunflower-6cf24d.netlify.app
   - Mở Console (F12)
   - Kiểm tra logs:
     - ✅ "Response Status: 200"
     - ✅ "Content-Type: application/json"
     - ✅ "Successfully fetched leaderboard"
   - Kiểm tra Network tab:
     - ✅ Request trỏ đến backend API URL
     - ✅ Response là JSON

---

## Troubleshooting

### Lỗi: "Expected JSON but received text/html"
**Nguyên nhân:** `VITE_API_URL` chưa được set hoặc đang trỏ đến Netlify URL

**Giải pháp:**
1. Kiểm tra `VITE_API_URL` trong Netlify Dashboard
2. Đảm bảo URL là backend API URL (không phải Netlify URL)
3. Redeploy site

### Lỗi: "Failed to fetch"
**Nguyên nhân:** Backend API không khả dụng hoặc CORS chưa cấu hình

**Giải pháp:**
1. Kiểm tra backend API có đang chạy không
2. Test backend API: `curl https://your-backend-api-url.com/health`
3. Kiểm tra `ALLOWED_ORIGINS` trong backend env vars

### Lỗi: "Database connection failed"
**Nguyên nhân:** `DATABASE_URL` không đúng hoặc database không khả dụng

**Giải pháp:**
1. Kiểm tra `DATABASE_URL` trong backend env vars
2. Đảm bảo Neon PostgreSQL database đang hoạt động
3. Test connection: `npm run db:check`

---

## Checklist

### Backend Deployment
- [ ] Backend đã được deploy lên Railway/Render
- [ ] Environment variables đã được set:
  - [ ] `DATABASE_URL`
  - [ ] `PORT`
  - [ ] `ALLOWED_ORIGINS`
  - [ ] `NODE_ENV`
- [ ] Backend API đang chạy và có thể truy cập
- [ ] Health endpoint trả về 200 OK
- [ ] Leaderboard endpoint trả về JSON

### Netlify Setup
- [ ] `VITE_API_URL` đã được set = Backend API URL
- [ ] Các env vars khác đã được set
- [ ] Site đã được redeploy sau khi set env vars
- [ ] Deployment đã hoàn tất

### Testing
- [ ] Frontend load thành công
- [ ] Console không có lỗi API
- [ ] Leaderboard hiển thị đúng
- [ ] Quiz functionality hoạt động
- [ ] API calls trả về JSON (không phải HTML)

---

## Resources

- **DEPLOYMENT_GUIDE.md** - Hướng dẫn deploy backend chi tiết
- **NETLIFY_AUTO_SETUP.md** - Hướng dẫn setup Netlify với API token
- **NETLIFY_ENV_SETUP.md** - Hướng dẫn manual setup Netlify
- **DEPLOYMENT_STATUS.md** - Trạng thái deployment hiện tại
- **TROUBLESHOOTING.md** - Hướng dẫn xử lý lỗi

---

## Support

Nếu gặp vấn đề, kiểm tra:
1. Backend API có đang chạy không
2. Environment variables có đúng không
3. CORS configuration có đúng không
4. Database connection có hoạt động không

Good luck! 🚀

