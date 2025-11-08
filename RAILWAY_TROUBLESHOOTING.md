# Railway Troubleshooting Guide

## Vấn đề: Railway đang serve frontend (HTML) thay vì backend API

### Triệu chứng

- Khi test `/health` endpoint, response trả về HTML thay vì JSON
- Response có chứa `<!doctype html>` 
- API endpoints không hoạt động

### Nguyên nhân

Railway có thể đang:
1. Serve static files từ `dist` folder (frontend build)
2. Chạy frontend dev server thay vì backend server
3. Cấu hình Start Command không đúng

### Giải pháp

#### Bước 1: Kiểm tra Railway Settings

1. Đăng nhập vào Railway Dashboard
2. Chọn project: `quiz-game`
3. Vào **Settings** > **Deploy**
4. Kiểm tra các settings sau:

**Start Command:**
```
npm run server
```

**Build Command:**
```
npm install
```
(Hoặc để trống, Railway sẽ tự động chạy `npm install`)

**Root Directory:**
```
.
```
(Để trống hoặc `.`)

#### Bước 2: Kiểm tra Environment Variables

Vào **Variables** tab và đảm bảo có:

- `DATABASE_URL` = `postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- `PORT` = `3002` (hoặc để Railway tự động assign)
- `ALLOWED_ORIGINS` = `https://leafy-sunflower-6cf24d.netlify.app`
- `NODE_ENV` = `production`

#### Bước 3: Kiểm tra railway.json

Đảm bảo `railway.json` có cấu hình đúng:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm run server",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

#### Bước 4: Kiểm tra nixpacks.toml

Đảm bảo `nixpacks.toml` có cấu hình đúng:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run db:migrate || true"]

[start]
cmd = "npm run server"
```

#### Bước 5: Kiểm tra Railway Logs

1. Vào Railway Dashboard > Project > Deployments
2. Click vào deployment mới nhất
3. Xem logs để kiểm tra:
   - Server có đang start không?
   - Có lỗi gì không?
   - Port nào đang được sử dụng?

**Logs mong đợi:**
```
🚀 API server running on http://localhost:3002
✅ Connected to Neon PostgreSQL database
```

#### Bước 6: Redeploy

1. Sau khi thay đổi cấu hình, click **Redeploy** trong Railway Dashboard
2. Đợi deployment hoàn tất (thường 2-3 phút)
3. Kiểm tra logs để đảm bảo server đang chạy

#### Bước 7: Test lại

```bash
# Test health endpoint
curl https://quiz-game-production-a421.up.railway.app/health

# Expected response:
# {"status":"ok","message":"API server is running"}
```

### Alternative: Tạo Service riêng cho Backend

Nếu vẫn gặp vấn đề, có thể tách backend thành một service riêng:

1. Tạo một service mới trong Railway project
2. Chọn "Deploy from GitHub repo"
3. Chọn repository và branch
4. Set Root Directory: `.` (hoặc để trống)
5. Set Start Command: `npm run server`
6. Set Environment Variables như trên

### Kiểm tra Package.json

Đảm bảo `package.json` có script đúng:

```json
{
  "scripts": {
    "server": "tsx server/index.ts",
    "start": "npm run server"
  }
}
```

### Kiểm tra Server Code

Đảm bảo `server/index.ts` có code start server:

```typescript
const PORT = process.env.PORT || 3002

const server = app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})
```

### Common Issues

#### Issue 1: Railway không detect đúng start command

**Giải pháp:** Set Start Command trực tiếp trong Railway Settings

#### Issue 2: Port conflict

**Giải pháp:** Railway tự động assign PORT, không cần set trong code. Chỉ cần đảm bảo server listen trên `process.env.PORT`

#### Issue 3: Database connection failed

**Giải pháp:** 
- Kiểm tra DATABASE_URL đúng không
- Kiểm tra database có accessible không
- Kiểm tra SSL mode

#### Issue 4: Migration failed

**Giải pháp:**
- Kiểm tra migration script có chạy không
- Kiểm tra database connection
- Xem logs để biết lỗi cụ thể

### Test Scripts

Sau khi fix, test lại:

```bash
# Test Railway API
npm run test:railway

# Hoặc
node scripts/test-railway.js https://quiz-game-production-a421.up.railway.app
```

### Next Steps

Sau khi Railway backend hoạt động:

1. Test API endpoints
2. Setup Netlify VITE_API_URL
3. Test frontend với backend
4. Verify end-to-end functionality

### Resources

- Railway Documentation: https://docs.railway.app
- Railway Dashboard: https://railway.app/dashboard
- Project URL: https://quiz-game-production-a421.up.railway.app

