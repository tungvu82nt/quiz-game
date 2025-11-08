# Hướng dẫn xử lý lỗi

## Lỗi: "Unexpected token '<', "<!doctype "... is not valid JSON"

### Nguyên nhân
Lỗi này xảy ra khi frontend cố gắng parse HTML response như JSON. Thường do:
1. **Backend API server chưa được deploy** - Frontend đang cố kết nối đến URL không tồn tại
2. **VITE_API_URL chưa được cấu hình đúng** trong Netlify Dashboard
3. **URL API không đúng** - Có thể trỏ đến Netlify URL (frontend) thay vì backend API URL

### Giải pháp

#### 1. Kiểm tra VITE_API_URL trong Netlify Dashboard

1. Đăng nhập vào [Netlify Dashboard](https://app.netlify.com)
2. Chọn site của bạn (ví dụ: `leafy-sunflower-6cf24d`)
3. Vào **Site settings** > **Environment variables**
4. Kiểm tra xem `VITE_API_URL` đã được set chưa
5. **QUAN TRỌNG**: `VITE_API_URL` phải trỏ đến **backend API server**, KHÔNG phải Netlify URL
   - ❌ Sai: `https://leafy-sunflower-6cf24d.netlify.app`
   - ✅ Đúng: `https://your-backend-api.railway.app` hoặc `https://your-backend-api.render.com`

#### 2. Deploy Backend API Server

Backend API server cần được deploy trên một platform khác (Netlify chỉ deploy frontend):

**Option A: Railway (Khuyến nghị)**
1. Đăng ký tại [Railway](https://railway.app)
2. Tạo project mới
3. Deploy từ GitHub repository
4. Set environment variables:
   - `DATABASE_URL`: Connection string Neon PostgreSQL
   - `PORT`: 3002 (hoặc port do Railway chỉ định)
   - `ALLOWED_ORIGINS`: `https://leafy-sunflower-6cf24d.netlify.app`
5. Lấy URL của backend API (ví dụ: `https://quiz-api.railway.app`)

**Option B: Render**
1. Đăng ký tại [Render](https://render.com)
2. Tạo Web Service mới
3. Connect GitHub repository
4. Set environment variables tương tự Railway
5. Lấy URL của backend API

**Option C: Fly.io**
1. Đăng ký tại [Fly.io](https://fly.io)
2. Deploy ứng dụng
3. Set environment variables
4. Lấy URL của backend API

#### 3. Cấu hình CORS trong Backend

Đảm bảo backend API server đã cấu hình CORS để cho phép Netlify domain:

```typescript
// server/index.ts
const allowedOrigins = [
  'http://localhost:5173',
  'https://leafy-sunflower-6cf24d.netlify.app'
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
```

#### 4. Test Backend API

Sau khi deploy backend, test API endpoint:

```bash
# Test health check
curl https://your-backend-api.railway.app/health

# Test leaderboard
curl https://your-backend-api.railway.app/api/leaderboard
```

Response phải là JSON, không phải HTML.

#### 5. Cập nhật VITE_API_URL trong Netlify

1. Vào Netlify Dashboard > Site settings > Environment variables
2. Set `VITE_API_URL` = URL của backend API (ví dụ: `https://quiz-api.railway.app`)
3. Redeploy site để áp dụng thay đổi

#### 6. Kiểm tra lại

1. Mở Netlify URL: `https://leafy-sunflower-6cf24d.netlify.app`
2. Mở Developer Console (F12)
3. Kiểm tra Network tab:
   - Request đến `/api/leaderboard` phải trả về JSON
   - Status code phải là 200
   - Content-Type phải là `application/json`

### Fallback Behavior

Ứng dụng đã được cấu hình để tự động fallback về localStorage nếu API không khả dụng:
- Dữ liệu sẽ được lưu vào localStorage
- Thông báo lỗi sẽ hiển thị cho user
- Ứng dụng vẫn hoạt động bình thường (offline mode)

### Debug Tips

1. **Kiểm tra Console Logs**:
   - Mở Developer Console (F12)
   - Xem tab Console để kiểm tra lỗi chi tiết
   - Xem tab Network để kiểm tra API requests

2. **Kiểm tra API URL**:
   ```javascript
   // Trong browser console
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```

3. **Test API trực tiếp**:
   ```bash
   # Test với curl
   curl -v https://your-backend-api.railway.app/api/leaderboard
   
   # Hoặc mở trong browser
   https://your-backend-api.railway.app/api/leaderboard
   ```

4. **Kiểm tra CORS**:
   - Nếu có lỗi CORS, kiểm tra lại cấu hình CORS trong backend
   - Đảm bảo Netlify domain được thêm vào `allowedOrigins`

## Lỗi khác

### "Failed to fetch"
- Kiểm tra backend API server có đang chạy không
- Kiểm tra URL API có đúng không
- Kiểm tra firewall/network settings

### "CORS policy: No 'Access-Control-Allow-Origin' header"
- Kiểm tra cấu hình CORS trong backend
- Đảm bảo Netlify domain được thêm vào `allowedOrigins`

### "Database connection error"
- Kiểm tra `DATABASE_URL` trong backend environment variables
- Kiểm tra Neon PostgreSQL database có đang hoạt động không
- Kiểm tra network connectivity từ backend đến database

