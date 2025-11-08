# Hướng dẫn Tự động Setup Netlify với API Token

## Tổng quan

Script tự động cấu hình Netlify Environment Variables sử dụng Netlify API token, giúp tự động hóa việc setup sau khi deploy backend.

---

## Bước 1: Chuẩn bị

### 1.1. Netlify API Token
API token đã được cấu hình trong `.env`:
```
API_NETLIFY=nfp_TrrRjnf9GdweZEYHCDrMFFijAeFJUK9B3423
NETLIFY_API_TOKEN=nfp_TrrRjnf9GdweZEYHCDrMFFijAeFJUK9B3423
```

**Lưu ý:** Token đã được thêm vào `.gitignore`, không commit vào git.

### 1.2. Backend API URL
Cần có backend API URL sau khi deploy lên Railway/Render/Fly.io
- Ví dụ: `https://quiz-api.onrender.com`
- Ví dụ: `https://quiz-api-production-xxxx.up.railway.app`

---

## Bước 2: Sử dụng Script Tự động

### 2.1. Setup Netlify Environment Variables

```bash
# Sử dụng token từ .env
node scripts/setup-netlify-env.js <backend-api-url>

# Hoặc set token trực tiếp
NETLIFY_API_TOKEN=nfp_xxx node scripts/setup-netlify-env.js <backend-api-url>

# Hoặc sử dụng npm script
npm run setup:netlify <backend-api-url>
```

**Example:**
```bash
# Nếu backend deploy trên Render
node scripts/setup-netlify-env.js https://quiz-api.onrender.com

# Nếu backend deploy trên Railway
node scripts/setup-netlify-env.js https://quiz-api-production-xxxx.up.railway.app
```

### 2.2. Script sẽ tự động:
1. ✅ Kết nối đến Netlify API
2. ✅ Set các environment variables:
   - `VITE_API_URL` = Backend API URL
   - `VITE_ANALYSIS_API_URL` = `https://api.minimax.chat/v1/`
   - `VITE_ANALYSIS_API_KEY` = (từ .env)
   - `VITE_ANALYSIS_API_PATH` = `chat/completions`
   - `VITE_ANALYSIS_MODEL` = `MiniMax-M2`
   - `VITE_PROMPT_STYLE` = `narrative`
   - `VITE_ANALYSIS_USE_MOCK` = `1`
3. ✅ Trigger new deployment với clear cache

---

## Bước 3: Kiểm tra Deployment

### 3.1. Sử dụng Script Check

```bash
# Check deployment status
node scripts/check-deployment.js <backend-api-url>

# Hoặc sử dụng npm script
npm run check:deployment <backend-api-url>
```

**Example:**
```bash
node scripts/check-deployment.js https://quiz-api.onrender.com
```

### 3.2. Script sẽ kiểm tra:
1. ✅ Backend API Health endpoint
2. ✅ Backend API Leaderboard endpoint
3. ✅ Netlify Site accessibility
4. ✅ Frontend API Configuration
5. ✅ CORS Configuration

### 3.3. Kiểm tra thủ công

1. **Mở Browser:**
   - URL: https://leafy-sunflower-6cf24d.netlify.app

2. **Mở Developer Console (F12):**
   - Tab Console: Kiểm tra logs
   - Tab Network: Kiểm tra API requests

3. **Kiểm tra Console Logs:**
   - Should see: "Response Status: 200"
   - Should see: "Content-Type: application/json"
   - Should see: "Successfully fetched leaderboard: X items"
   - Should NOT see: "Expected JSON but received text/html"

4. **Kiểm tra Network Tab:**
   - Request đến `/api/leaderboard` phải trỏ đến backend API URL
   - Status: 200
   - Content-Type: `application/json`
   - Response: JSON array

---

## Bước 4: Workflow Hoàn chỉnh

### 4.1. Deploy Backend
```bash
# 1. Deploy backend lên Railway/Render/Fly.io
# 2. Lấy backend API URL
# 3. Test backend API
curl https://your-backend-api-url.com/health
```

### 4.2. Setup Netlify
```bash
# 1. Setup Netlify environment variables
node scripts/setup-netlify-env.js https://your-backend-api-url.com

# 2. Đợi deployment hoàn tất (1-2 phút)
# 3. Check deployment
node scripts/check-deployment.js https://your-backend-api-url.com
```

### 4.3. Test Frontend
```bash
# 1. Mở browser: https://leafy-sunflower-6cf24d.netlify.app
# 2. Test quiz functionality
# 3. Check leaderboard
# 4. Verify API calls trong Console
```

---

## Troubleshooting

### Lỗi: "NETLIFY_API_TOKEN is required"
**Nguyên nhân:** Token chưa được set

**Giải pháp:**
1. Kiểm tra `.env` có chứa `API_NETLIFY` hoặc `NETLIFY_API_TOKEN`
2. Hoặc set trực tiếp: `NETLIFY_API_TOKEN=xxx node scripts/setup-netlify-env.js ...`

### Lỗi: "Failed to get site info"
**Nguyên nhân:** Token không hợp lệ hoặc không có quyền

**Giải pháp:**
1. Kiểm tra token có đúng không
2. Kiểm tra token có quyền truy cập site không
3. Tạo token mới từ Netlify Dashboard: User settings > Applications > New access token

### Lỗi: "Backend API not accessible"
**Nguyên nhân:** Backend chưa được deploy hoặc URL sai

**Giải pháp:**
1. Kiểm tra backend API có đang chạy không
2. Test backend API trực tiếp: `curl https://your-backend-api-url.com/health`
3. Kiểm tra URL có đúng không

### Environment Variables không được áp dụng
**Nguyên nhân:** Chưa trigger deployment sau khi set env vars

**Giải pháp:**
1. Script tự động trigger deployment
2. Hoặc manual trigger: Netlify Dashboard > Deploys > Trigger deploy
3. Đảm bảo clear cache khi deploy

---

## Security Notes

⚠️ **QUAN TRỌNG:**
- ❌ **KHÔNG** commit API token vào git
- ✅ Token đã được thêm vào `.gitignore`
- ✅ Chỉ sử dụng token trong môi trường development/local
- ✅ Trong production, sử dụng CI/CD secrets hoặc environment variables

---

## API Token Management

### Tạo Token mới (nếu cần)
1. Đăng nhập Netlify: https://app.netlify.com
2. Vào **User settings** > **Applications**
3. Click **New access token**
4. Đặt tên và chọn permissions
5. Copy token và lưu vào `.env`

### Revoke Token (nếu bị lộ)
1. Vào **User settings** > **Applications**
2. Tìm token cần revoke
3. Click **Revoke**
4. Tạo token mới và cập nhật `.env`

---

## Quick Reference

### Commands
```bash
# Setup Netlify env vars
node scripts/setup-netlify-env.js <backend-api-url>

# Check deployment
node scripts/check-deployment.js <backend-api-url>

# Test API
npm run test:api <backend-api-url>
```

### URLs
- Netlify Site: https://leafy-sunflower-6cf24d.netlify.app
- Netlify Dashboard: https://app.netlify.com/sites/leafy-sunflower-6cf24d
- Netlify API: https://api.netlify.com/api/v1

### Environment Variables
- `API_NETLIFY` hoặc `NETLIFY_API_TOKEN`: Netlify API token
- `BACKEND_API_URL`: Backend API URL (optional, có thể pass as argument)

---

Good luck! 🚀

