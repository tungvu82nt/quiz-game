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

### GET /api/tracking
Lấy dữ liệu tracking (GPS và IP). Có thể dùng query parameter `limit` để giới hạn số lượng kết quả (mặc định: 100).

**Query Parameters:**
- `limit` (optional): Số lượng records tối đa (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "leaderboardId": 1,
    "ipAddress": "::1",
    "latitude": 10.754596,
    "longitude": 106.667526,
    "accuracy": 17,
    "timestamp": 1234567890000,
    "userName": "Test User",
    "score": 10
  }
]
```

### GET /api/tracking/stats
Thống kê tracking data.

**Response:**
```json
{
  "totalRecords": 10,
  "uniqueIPs": 5,
  "gpsRecords": 8,
  "firstRecord": "2025-01-08T10:00:00.000Z",
  "lastRecord": "2025-01-08T12:00:00.000Z"
}
```

## Database Schema

### Bảng `leaderboard`:
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL
- `score`: INTEGER NOT NULL
- `summary`: TEXT NOT NULL
- `analysis_title`: VARCHAR(500)
- `analysis_summary`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

**Indexes:**
- `idx_leaderboard_score`: trên `score DESC`
- `idx_leaderboard_created_at`: trên `created_at DESC`
- `idx_leaderboard_score_created`: composite trên `score DESC, created_at DESC`

### Bảng `quiz_tracking`:
- `id`: SERIAL PRIMARY KEY
- `leaderboard_id`: INTEGER REFERENCES leaderboard(id) ON DELETE CASCADE
- `ip_address`: VARCHAR(45) NOT NULL
- `latitude`: DOUBLE PRECISION
- `longitude`: DOUBLE PRECISION
- `accuracy`: DOUBLE PRECISION
- `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

**Indexes:**
- `idx_quiz_tracking_ip_address`: trên `ip_address`
- `idx_quiz_tracking_created_at`: trên `created_at DESC`
- `idx_quiz_tracking_leaderboard_id`: trên `leaderboard_id`

## Scripts

### Kiểm tra database:
```bash
npm run db:check
```

Script này sẽ hiển thị:
- Số lượng records trong mỗi bảng
- Latest tracking records với GPS và IP
- Thống kê (total records, unique IPs, GPS records)
- Top IPs

