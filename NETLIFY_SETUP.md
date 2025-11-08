# Hướng dẫn cấu hình Netlify

## Environment Variables cần thiết

Để ứng dụng hoạt động trên Netlify, cần cấu hình các environment variables sau trong **Netlify Dashboard**:

### 1. Frontend Environment Variables (cho build)

Các biến này được sử dụng khi build frontend trên Netlify:

#### `VITE_API_URL`
- **Mô tả**: URL của backend API server
- **Ví dụ**: `https://your-backend-api.railway.app` hoặc `https://your-backend-api.render.com`
- **Lưu ý**: Không phải Netlify URL! Đây là URL của backend API server (chạy trên Railway, Render, Fly.io, v.v.)

#### `VITE_ANALYSIS_API_URL`
- **Mô tả**: URL của AI analysis API (MiniMax)
- **Giá trị**: `https://api.minimax.chat/v1/`

#### `VITE_ANALYSIS_API_KEY`
- **Mô tả**: API key cho MiniMax
- **Giá trị**: (giữ nguyên từ .env)

#### `VITE_ANALYSIS_API_PATH`
- **Mô tả**: API path cho MiniMax
- **Giá trị**: `chat/completions`

#### `VITE_ANALYSIS_MODEL`
- **Mô tả**: Model name cho MiniMax
- **Giá trị**: `MiniMax-M2`

#### `VITE_PROMPT_STYLE`
- **Mô tả**: Style của prompt
- **Giá trị**: `narrative`

#### `VITE_ANALYSIS_USE_MOCK`
- **Mô tả**: Sử dụng mock analysis hay không
- **Giá trị**: `1` (mock) hoặc `0` (real API)

### 2. Backend Environment Variables (KHÔNG cần cho Netlify)

Các biến này chỉ cần cho backend server (chạy trên Railway, Render, v.v.), **KHÔNG** cần set trong Netlify:

- `DATABASE_URL`: Connection string đến Neon PostgreSQL (chỉ backend cần)
- `PORT`: Port cho backend server (chỉ backend cần)

## Cách cấu hình Environment Variables trong Netlify

1. Đăng nhập vào [Netlify Dashboard](https://app.netlify.com)
2. Chọn site của bạn (ví dụ: `leafy-sunflower-6cf24d`)
3. Vào **Site settings** > **Environment variables**
4. Thêm các biến môi trường cần thiết:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api-url.com`
5. Click **Save**
6. Redeploy site để áp dụng thay đổi

## Lưu ý quan trọng

### Backend API Server
- Netlify chỉ deploy **frontend** (static site)
- Backend API server cần chạy trên platform khác:
  - **Railway**: https://railway.app
  - **Render**: https://render.com
  - **Fly.io**: https://fly.io
  - **Heroku**: https://heroku.com
  - **VPS**: Bất kỳ VPS nào

### DATABASE_URL
- `DATABASE_URL` **KHÔNG** cần set trong Netlify
- `DATABASE_URL` chỉ cần cho backend server
- Set `DATABASE_URL` trong environment variables của backend platform (Railway, Render, v.v.)

### VITE_API_URL
- Phải trỏ đến **backend API URL** (không phải Netlify URL)
- Ví dụ: Nếu backend chạy trên Railway tại `https://quiz-api.railway.app`, thì:
  - `VITE_API_URL=https://quiz-api.railway.app`

## Kiểm tra sau khi deploy

1. Mở Netlify URL: `https://leafy-sunflower-6cf24d.netlify.app`
2. Mở Developer Console (F12)
3. Kiểm tra Network tab xem frontend có kết nối đến backend API không
4. Nếu có lỗi CORS, cần cấu hình CORS trong backend để cho phép Netlify domain

