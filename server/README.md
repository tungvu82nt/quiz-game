# Backend API Server

## Cấu hình

Backend API server sử dụng Express và PostgreSQL (Neon) để lưu trữ kết quả trắc nghiệm.

### Biến môi trường

File `.env` đã được cấu hình với:
- `DATABASE_URL`: Connection string đến Neon PostgreSQL
- `PORT`: Port cho API server (mặc định: 3001)
- `VITE_API_URL`: URL API cho frontend (mặc định: http://localhost:3001)

## Chạy Migration

Trước khi chạy server lần đầu, cần chạy migration để tạo bảng trong database:

```bash
npm run db:migrate
```

## Chạy Server

### Chạy riêng API server:
```bash
npm run server
```

### Chạy cả frontend và backend cùng lúc:
```bash
npm run dev:all
```

### Chạy riêng frontend:
```bash
npm run dev
```

### Chạy riêng backend với watch mode:
```bash
npm run dev:server
```

## API Endpoints

### GET /api/leaderboard
Lấy danh sách top 50 kết quả từ database.

**Response:**
```json
[
  {
    "name": "Test User",
    "score": 9,
    "summary": "Tổng 9 điểm. Xu hướng nổi trội: Hướng ngoại + Hệ thống.",
    "timestamp": 1234567890000,
    "analysisTitle": "Phân tích mô phỏng (narrative)",
    "analysisSummary": "Bên trong (Tư duy/Cảm xúc): ..."
  }
]
```

### POST /api/leaderboard
Thêm kết quả mới vào database.

**Request Body:**
```json
{
  "name": "Test User",
  "score": 9,
  "summary": "Tổng 9 điểm. Xu hướng nổi trội: Hướng ngoại + Hệ thống.",
  "timestamp": 1234567890000,
  "analysisTitle": "Phân tích mô phỏng (narrative)",
  "analysisSummary": "Bên trong (Tư duy/Cảm xúc): ..."
}
```

**Response:**
```json
{
  "name": "Test User",
  "score": 9,
  "summary": "...",
  "timestamp": 1234567890000,
  "analysisTitle": "...",
  "analysisSummary": "..."
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

## Database Schema

Bảng `leaderboard`:
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL
- `score`: INTEGER NOT NULL
- `summary`: TEXT NOT NULL
- `analysis_title`: VARCHAR(500)
- `analysis_summary`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

Indexes:
- `idx_leaderboard_score`: trên `score DESC`
- `idx_leaderboard_created_at`: trên `created_at DESC`
- `idx_leaderboard_score_created`: composite trên `score DESC, created_at DESC`

