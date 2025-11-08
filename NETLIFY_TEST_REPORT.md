# 🔍 Báo cáo kiểm tra Netlify - Test Report

## 📅 Ngày kiểm tra
$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## ✅ Kết quả kiểm tra

### 1. Frontend (Netlify Site)
- **URL**: https://leafy-sunflower-6cf24d.netlify.app
- **Status**: ✅ Hoạt động bình thường
- **UI**: ✅ Hiển thị đúng
- **Page Load**: ✅ Load thành công

### 2. Backend API
- **Status**: ❌ **CHƯA ĐƯỢC DEPLOY HOẶC VITE_API_URL CHƯA ĐƯỢC SET**
- **Vấn đề phát hiện**:
  - Console log cho thấy: `API URL: https://leafy-sunflower-6cf24d.netlify.app/api/leaderboard`
  - Frontend đang dùng **relative URL** thay vì backend API URL
  - Response trả về **HTML** thay vì **JSON**
  - Error: `Expected JSON but received text/html; charset=UTF-8`

### 3. Console Errors
```
[ERROR] Expected JSON but received non-JSON response
[ERROR] Failed to fetch leaderboard from API
```

### 4. Network Requests
- Request đến: `https://leafy-sunflower-6cf24d.netlify.app/api/leaderboard`
- Response: HTML (Netlify đang serve trang frontend)
- Expected: JSON từ backend API

---

## 🔧 Nguyên nhân

1. **VITE_API_URL chưa được set trong Netlify Dashboard**
   - Khi `VITE_API_URL` không được set, frontend dùng relative URL
   - Relative URL dẫn đến việc gọi API trên chính Netlify domain
   - Netlify không có backend API, nên trả về HTML page

2. **Backend API chưa được deploy**
   - Backend API server cần được deploy lên Railway/Render/Fly.io
   - Sau đó set `VITE_API_URL` trong Netlify Dashboard

---

## ✅ Giải pháp

### Bước 1: Deploy Backend API Server

Chọn một trong các platform:

#### Option 1: Railway (Khuyến nghị)
```bash
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub
3. Deploy from GitHub: tungvu82nt/quiz-game
4. Set Environment Variables:
   - DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   - PORT=3002
   - ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
   - NODE_ENV=production
5. Lấy Backend URL: https://your-app.up.railway.app
```

#### Option 2: Render
```bash
1. Truy cập: https://render.com
2. Tạo Web Service từ GitHub repo
3. Set Environment Variables:
   - DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   - PORT=10000
   - ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
   - NODE_ENV=production
4. Lấy Backend URL: https://your-app.onrender.com
```

### Bước 2: Setup Netlify Environment Variables

#### Cách 1: Tự động (Khuyến nghị)

Sau khi có Backend URL, chạy:
```bash
node scripts/setup-netlify-env.js <backend-url>
```

Ví dụ:
```bash
node scripts/setup-netlify-env.js https://quiz-api.onrender.com
```

#### Cách 2: Thủ công

1. Đăng nhập Netlify: https://app.netlify.com
2. Chọn site: `leafy-sunflower-6cf24d`
3. Vào **Site settings** > **Environment variables**
4. Thêm/sửa:
   - Key: `VITE_API_URL`
   - Value: `<backend-url>` (ví dụ: `https://quiz-api.onrender.com`)
5. Click **Save**
6. Vào **Deploys** tab
7. Click **Trigger deploy** > **Clear cache and deploy site**

### Bước 3: Test lại

1. Đợi Netlify deploy xong (1-2 phút)
2. Mở: https://leafy-sunflower-6cf24d.netlify.app
3. Mở Developer Console (F12)
4. Kiểm tra:
   - ✅ Console không có lỗi
   - ✅ Network tab: API calls đến backend URL
   - ✅ Response là JSON
   - ✅ Leaderboard load được

---

## 📋 Checklist

- [ ] Backend API đã được deploy
- [ ] Backend URL đã được lấy
- [ ] Test backend API: `node scripts/test-api.js <backend-url>`
- [ ] VITE_API_URL đã được set trong Netlify Dashboard
- [ ] Netlify site đã được redeploy
- [ ] Test lại frontend: https://leafy-sunflower-6cf24d.netlify.app
- [ ] Console không có lỗi
- [ ] Leaderboard load được
- [ ] Submit score hoạt động

---

## 🔍 Kiểm tra nhanh

### Test Backend API
```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test leaderboard endpoint
curl https://your-backend-url.com/api/leaderboard
```

### Test Frontend
```bash
# Mở browser console và kiểm tra:
# 1. API URL phải là backend URL, không phải Netlify URL
# 2. Response phải là JSON
# 3. Không có CORS errors
```

### Script hỗ trợ
```bash
# Test backend API
node scripts/test-api.js <backend-url>

# Setup Netlify env vars
node scripts/setup-netlify-env.js <backend-url>

# Check deployment
node scripts/check-deployment.js <backend-url>
```

---

## 📚 Tài liệu tham khảo

- `DEPLOYMENT_GUIDE.md`: Hướng dẫn deploy backend
- `DEPLOYMENT_CHECKLIST.md`: Checklist từng bước
- `NETLIFY_AUTO_SETUP.md`: Setup Netlify tự động
- `NETLIFY_ENV_SETUP.md`: Setup Netlify thủ công

---

## ⚠️ Lưu ý

1. **VITE_API_URL phải được set TRƯỚC KHI BUILD**
   - Netlify build frontend với `VITE_API_URL` được inject vào code
   - Nếu set sau khi build, cần **redeploy** để có hiệu lực

2. **Backend API phải được deploy và hoạt động**
   - Backend phải có database connection
   - Backend phải có CORS configured
   - Backend phải có health endpoint

3. **Database migration**
   - Backend sẽ tự động chạy migration khi deploy (postinstall script)
   - Hoặc chạy thủ công: `npm run db:migrate`

---

**Tóm tắt**: Backend API chưa được deploy hoặc VITE_API_URL chưa được set trong Netlify. Cần deploy backend trước, sau đó set VITE_API_URL và redeploy Netlify site.

