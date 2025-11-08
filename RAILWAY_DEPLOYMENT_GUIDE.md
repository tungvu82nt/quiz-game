# Hướng dẫn Deploy Backend API lên Railway

## Tổng quan

Backend API server đã được deploy lên Railway tại: `https://quiz-game-production-a421.up.railway.app`

## Cấu hình Railway

### Environment Variables

Các biến môi trường cần được set trong Railway Dashboard:

```
DATABASE_URL=postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3002
ALLOWED_ORIGINS=https://leafy-sunflower-6cf24d.netlify.app
NODE_ENV=production
```

### Build & Start Commands

- **Build Command**: `npm install` (tự động chạy migration trong postinstall)
- **Start Command**: `npm run server`
- **Healthcheck Path**: `/health`

## Vấn đề và Giải pháp

### Vấn đề: Railway đang serve frontend thay vì backend

**Nguyên nhân**: Railway có thể đang detect và serve cả frontend build.

**Giải pháp**:
1. Đảm bảo `railway.json` có `startCommand: "npm run server"`
2. Đảm bảo `nixpacks.toml` cấu hình đúng
3. Kiểm tra Railway Settings > Deploy > Start Command phải là `npm run server`
4. Đảm bảo không có static files được serve (dist folder không nên được serve)

### Cách kiểm tra

1. Test health endpoint:
```bash
curl https://quiz-game-production-a421.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

2. Test leaderboard endpoint:
```bash
curl https://quiz-game-production-a421.up.railway.app/api/leaderboard
```

Expected response: JSON array of leaderboard items

## Cấu hình Railway Dashboard

### Bước 1: Vào Railway Project Settings

1. Đăng nhập vào Railway Dashboard
2. Chọn project: `quiz-game`
3. Vào **Settings** tab

### Bước 2: Kiểm tra Environment Variables

1. Vào **Variables** tab
2. Đảm bảo có các biến:
   - `DATABASE_URL`
   - `PORT` (optional, Railway tự động assign)
   - `ALLOWED_ORIGINS`
   - `NODE_ENV`

### Bước 3: Kiểm tra Deploy Settings

1. Vào **Settings** > **Deploy**
2. Đảm bảo **Start Command** là: `npm run server`
3. Đảm bảo **Build Command** là: `npm install` (hoặc để trống, Railway tự động chạy)
4. Đảm bảo **Healthcheck Path** là: `/health`

### Bước 4: Redeploy

1. Nếu đã thay đổi cấu hình, click **Redeploy**
2. Đợi deployment hoàn tất
3. Kiểm tra logs để đảm bảo server đang chạy

## Test Backend API

### Test health endpoint

```bash
curl https://quiz-game-production-a421.up.railway.app/health
```

### Test leaderboard endpoints

```bash
# GET leaderboard
curl https://quiz-game-production-a421.up.railway.app/api/leaderboard

# POST new entry
curl -X POST https://quiz-game-production-a421.up.railway.app/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "score": 10,
    "summary": "Test summary",
    "timestamp": 1234567890000
  }'
```

### Test với script

```bash
node scripts/test-api.js https://quiz-game-production-a421.up.railway.app
```

## Troubleshooting

### Lỗi: Railway serve HTML thay vì JSON

**Nguyên nhân**: Railway đang serve frontend build hoặc không chạy backend server.

**Giải pháp**:
1. Kiểm tra Railway logs để xem server có đang chạy không
2. Đảm bảo Start Command là `npm run server`
3. Kiểm tra PORT environment variable
4. Redeploy project

### Lỗi: Database connection failed

**Nguyên nhân**: DATABASE_URL không đúng hoặc database không accessible.

**Giải pháp**:
1. Kiểm tra DATABASE_URL trong Railway Variables
2. Test database connection từ local
3. Kiểm tra Neon database status

### Lỗi: CORS error

**Nguyên nhân**: ALLOWED_ORIGINS không chứa Netlify URL.

**Giải pháp**:
1. Đảm bảo ALLOWED_ORIGINS có giá trị: `https://leafy-sunflower-6cf24d.netlify.app`
2. Redeploy sau khi thay đổi environment variables

## Next Steps

Sau khi Backend API hoạt động:

1. Setup Netlify environment variables
2. Test frontend với backend
3. Verify end-to-end functionality

## Tài liệu tham khảo

- Railway Documentation: https://docs.railway.app
- Railway Dashboard: https://railway.app/dashboard
- Project URL: https://quiz-game-production-a421.up.railway.app

