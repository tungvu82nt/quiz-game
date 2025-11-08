# Hướng dẫn Cấu hình Environment Variables trong Netlify

## Sau khi Deploy Backend API Server

Sau khi đã deploy backend API server lên Railway/Render/Fly.io và có được backend URL, bạn cần cấu hình environment variables trong Netlify Dashboard.

---

## Bước 1: Lấy Backend API URL

Sau khi deploy backend, lấy URL từ platform bạn đã deploy:

- **Railway**: `https://your-app.up.railway.app`
- **Render**: `https://your-app.onrender.com`
- **Fly.io**: `https://your-app.fly.dev`

**Lưu ý:** Đảm bảo backend API đang chạy và có thể truy cập được. Test bằng cách:
```bash
curl https://your-backend-api-url.com/health
# Should return: {"status":"ok","message":"API server is running"}
```

---

## Bước 2: Cấu hình Netlify Dashboard

### 2.1. Đăng nhập Netlify
1. Truy cập https://app.netlify.com
2. Đăng nhập bằng GitHub account

### 2.2. Chọn Site
1. Tìm và click vào site: `leafy-sunflower-6cf24d`
2. Hoặc site của bạn nếu khác

### 2.3. Vào Environment Variables
1. Click **Site settings** (bên trái)
2. Scroll xuống và click **Environment variables**
3. Click **Add a variable** hoặc **Edit variables**

### 2.4. Thêm/Sửa Environment Variables

Thêm các biến sau:

#### A. VITE_API_URL (QUAN TRỌNG)
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-api-url.com` (URL từ bước 1)
- **Scopes**: `All scopes` hoặc `Production`
- **⚠️ Lưu ý:** 
  - KHÔNG phải Netlify URL!
  - Phải là URL của backend API server
  - Không có dấu `/` ở cuối

#### B. VITE_ANALYSIS_API_URL
- **Key**: `VITE_ANALYSIS_API_URL`
- **Value**: `https://api.minimax.chat/v1/`
- **Scopes**: `All scopes`

#### C. VITE_ANALYSIS_API_KEY
- **Key**: `VITE_ANALYSIS_API_KEY`
- **Value**: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...` (giữ nguyên từ .env)
- **Scopes**: `All scopes`

#### D. VITE_ANALYSIS_API_PATH
- **Key**: `VITE_ANALYSIS_API_PATH`
- **Value**: `chat/completions`
- **Scopes**: `All scopes`

#### E. VITE_ANALYSIS_MODEL
- **Key**: `VITE_ANALYSIS_MODEL`
- **Value**: `MiniMax-M2`
- **Scopes**: `All scopes`

#### F. VITE_PROMPT_STYLE
- **Key**: `VITE_PROMPT_STYLE`
- **Value**: `narrative`
- **Scopes**: `All scopes`

#### G. VITE_ANALYSIS_USE_MOCK
- **Key**: `VITE_ANALYSIS_USE_MOCK`
- **Value**: `1`
- **Scopes**: `All scopes`

### 2.5. Save và Redeploy
1. Click **Save** sau khi thêm tất cả biến
2. Vào **Deploys** tab (bên trái)
3. Click **Trigger deploy** > **Clear cache and deploy site**
4. Đợi deploy hoàn tất (thường mất 1-2 phút)

---

## Bước 3: Kiểm tra lại

### 3.1. Test Backend API
```bash
# Test health endpoint
curl https://your-backend-api-url.com/health

# Test leaderboard endpoint
curl https://your-backend-api-url.com/api/leaderboard
```

### 3.2. Test Frontend
1. Mở Netlify URL: `https://leafy-sunflower-6cf24d.netlify.app`
2. Mở Developer Console (F12)
3. Kiểm tra Console logs:
   - Should see: "Response Status: 200"
   - Should see: "Content-Type: application/json"
   - Should see: "Successfully fetched leaderboard: X items"
   - Should NOT see: "Expected JSON but received text/html"

### 3.3. Kiểm tra Network Tab
1. Mở Developer Console (F12)
2. Vào tab **Network**
3. Refresh page
4. Tìm request đến `/api/leaderboard`
5. Kiểm tra:
   - **Request URL**: Phải là backend API URL (không phải Netlify URL)
   - **Status**: 200
   - **Content-Type**: `application/json`
   - **Response**: Phải là JSON array, không phải HTML

---

## Troubleshooting

### Lỗi: "Expected JSON but received text/html"
**Nguyên nhân:** `VITE_API_URL` chưa được set hoặc đang trỏ đến Netlify URL

**Giải pháp:**
1. Kiểm tra `VITE_API_URL` trong Netlify Dashboard
2. Đảm bảo URL là backend API URL (không phải Netlify URL)
3. Redeploy site sau khi sửa

### Lỗi: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Nguyên nhân:** Backend chưa cấu hình CORS đúng

**Giải pháp:**
1. Kiểm tra `ALLOWED_ORIGINS` trong backend environment variables
2. Đảm bảo Netlify URL được thêm vào: `https://leafy-sunflower-6cf24d.netlify.app`
3. Redeploy backend sau khi sửa

### Lỗi: "Failed to fetch"
**Nguyên nhân:** Backend API không khả dụng hoặc URL sai

**Giải pháp:**
1. Kiểm tra backend API có đang chạy không
2. Test backend API trực tiếp: `curl https://your-backend-api-url.com/health`
3. Kiểm tra `VITE_API_URL` có đúng không

### Environment Variables không được áp dụng
**Nguyên nhân:** Chưa redeploy sau khi thêm biến

**Giải pháp:**
1. Vào **Deploys** tab
2. Click **Trigger deploy** > **Clear cache and deploy site**
3. Đợi deploy hoàn tất

---

## Environment Variables Checklist

Trước khi deploy, đảm bảo các biến sau đã được set:

### Frontend (Netlify Dashboard)
- [ ] `VITE_API_URL` = Backend API URL
- [ ] `VITE_ANALYSIS_API_URL` = `https://api.minimax.chat/v1/`
- [ ] `VITE_ANALYSIS_API_KEY` = Your API key
- [ ] `VITE_ANALYSIS_API_PATH` = `chat/completions`
- [ ] `VITE_ANALYSIS_MODEL` = `MiniMax-M2`
- [ ] `VITE_PROMPT_STYLE` = `narrative`
- [ ] `VITE_ANALYSIS_USE_MOCK` = `1`

### Backend (Railway/Render/Fly.io)
- [ ] `DATABASE_URL` = Neon PostgreSQL connection string
- [ ] `PORT` = `3002` (Railway/Fly.io) hoặc `10000` (Render)
- [ ] `ALLOWED_ORIGINS` = `https://leafy-sunflower-6cf24d.netlify.app`
- [ ] `NODE_ENV` = `production`

---

## Quick Reference

### Backend API URL Examples
```
Railway: https://quiz-api-production-xxxx.up.railway.app
Render:  https://quiz-api.onrender.com
Fly.io:  https://quiz-api.fly.dev
```

### Test Commands
```bash
# Test backend health
curl https://your-backend-api-url.com/health

# Test backend leaderboard
curl https://your-backend-api-url.com/api/leaderboard

# Test với script
npm run test:api https://your-backend-api-url.com
```

### Netlify Dashboard Links
- Site Settings: https://app.netlify.com/sites/leafy-sunflower-6cf24d/configuration/env
- Deploys: https://app.netlify.com/sites/leafy-sunflower-6cf24d/deploys

---

Good luck! 🚀

