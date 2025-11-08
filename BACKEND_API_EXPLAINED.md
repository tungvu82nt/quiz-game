# Backend API là gì? - Giải thích chi tiết

## 📚 Khái niệm cơ bản

### Frontend vs Backend

**Frontend (Client-side):**
- Là phần người dùng nhìn thấy và tương tác
- Chạy trên trình duyệt (browser)
- Ví dụ: Giao diện game quiz, form nhập tên, hiển thị leaderboard

**Backend (Server-side):**
- Là phần xử lý logic, lưu trữ dữ liệu
- Chạy trên server (máy chủ)
- Người dùng không nhìn thấy trực tiếp
- Ví dụ: Lưu điểm số vào database, xử lý GPS tracking, tính toán thống kê

### API (Application Programming Interface)

**API** là cách Frontend và Backend giao tiếp với nhau:

```
Frontend (Browser)  ←→  API  ←→  Backend (Server)  ←→  Database
```

- **Frontend** gửi request (yêu cầu) đến Backend qua API
- **Backend** xử lý request và trả về response (phản hồi)
- Dữ liệu được lưu trữ trong **Database**

---

## 🔍 Backend API trong project này

### 1. Vai trò của Backend API

Backend API trong project Quiz Game có các chức năng:

#### a) Lưu trữ điểm số (Leaderboard)
```
Frontend: User submit điểm số
    ↓
Backend API: Lưu vào database
    ↓
Database: Lưu điểm số, tên, thời gian
```

#### b) Hiển thị bảng xếp hạng
```
Frontend: Request danh sách leaderboard
    ↓
Backend API: Lấy dữ liệu từ database
    ↓
Database: Trả về top 50 điểm số
    ↓
Backend API: Trả về JSON
    ↓
Frontend: Hiển thị bảng xếp hạng
```

#### c) Tracking (GPS + IP)
```
Frontend: Gửi GPS location
    ↓
Backend API: Lưu GPS + IP address
    ↓
Database: Lưu tracking data
```

### 2. Cấu trúc Backend API

```
quiz-game/
├── server/                 # Backend API Server
│   ├── index.ts           # Main server file
│   ├── db.ts              # Database connection
│   ├── schema.sql         # Database schema
│   └── middleware/        # Middleware (IP tracking)
│
├── src/                   # Frontend
│   ├── pages/            # Game pages
│   └── hooks/            # API calls
│
└── .env                   # Environment variables
```

### 3. API Endpoints

Backend API có các endpoints (điểm cuối) sau:

#### GET /health
**Mục đích:** Kiểm tra server có hoạt động không

**Request:**
```http
GET http://localhost:3002/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

#### GET /api/leaderboard
**Mục đích:** Lấy danh sách top 50 điểm số

**Request:**
```http
GET http://localhost:3002/api/leaderboard
```

**Response:**
```json
[
  {
    "name": "Nguyễn Văn A",
    "score": 10,
    "summary": "Tổng 10 điểm...",
    "timestamp": 1234567890000,
    "analysisTitle": "Phân tích...",
    "analysisSummary": "Bạn là người..."
  },
  ...
]
```

#### POST /api/leaderboard
**Mục đích:** Thêm điểm số mới vào database

**Request:**
```http
POST http://localhost:3002/api/leaderboard
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "score": 10,
  "summary": "Tổng 10 điểm...",
  "timestamp": 1234567890000,
  "gpsData": {
    "latitude": 10.762622,
    "longitude": 106.660172,
    "accuracy": 10
  }
}
```

**Response:**
```json
{
  "name": "Nguyễn Văn A",
  "score": 10,
  "summary": "Tổng 10 điểm...",
  "timestamp": 1234567890000
}
```

#### GET /api/tracking
**Mục đích:** Lấy dữ liệu tracking (GPS + IP)

**Request:**
```http
GET http://localhost:3002/api/tracking?limit=100
```

**Response:**
```json
[
  {
    "id": 1,
    "leaderboard_id": 1,
    "ip_address": "192.168.1.1",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "accuracy": 10,
    "created_at": "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### GET /api/tracking/stats
**Mục đích:** Lấy thống kê tracking

**Request:**
```http
GET http://localhost:3002/api/tracking/stats
```

**Response:**
```json
{
  "totalRecords": 100,
  "uniqueIPs": 50,
  "withGPS": 80,
  "withoutGPS": 20
}
```

---

## 🔄 Luồng hoạt động (Flow)

### Ví dụ: User submit điểm số

```
1. User chơi quiz và hoàn thành
   ↓
2. Frontend gọi API: POST /api/leaderboard
   ↓
3. Backend API nhận request:
   - Validate dữ liệu
   - Lấy IP address từ request
   - Lưu vào database (leaderboard table)
   - Lưu GPS + IP vào database (quiz_tracking table)
   ↓
4. Database trả về kết quả
   ↓
5. Backend API trả về response (JSON)
   ↓
6. Frontend nhận response và hiển thị thông báo
```

### Ví dụ: Hiển thị leaderboard

```
1. User vào trang Leaderboard
   ↓
2. Frontend gọi API: GET /api/leaderboard
   ↓
3. Backend API nhận request:
   - Query database: SELECT * FROM leaderboard ORDER BY score DESC LIMIT 50
   ↓
4. Database trả về dữ liệu
   ↓
5. Backend API format dữ liệu và trả về JSON
   ↓
6. Frontend nhận JSON và hiển thị bảng xếp hạng
```

---

## 🛠️ Công nghệ sử dụng

### Backend API Stack

1. **Node.js** - Runtime environment
2. **Express.js** - Web framework
3. **PostgreSQL** (Neon) - Database
4. **TypeScript** - Programming language
5. **CORS** - Cross-Origin Resource Sharing

### Frontend Stack

1. **React** - UI framework
2. **Vite** - Build tool
3. **TypeScript** - Programming language
4. **React Router** - Routing

---

## 🌐 Deployment

### Kiến trúc Deployment

```
┌─────────────────┐
│   Netlify       │  ← Frontend (Static Site)
│   (Frontend)    │     https://leafy-sunflower-6cf24d.netlify.app
└────────┬────────┘
         │
         │ API Calls (HTTP)
         │
┌────────▼────────┐
│ Railway/Render  │  ← Backend API (Server)
│  (Backend API)  │     https://quiz-api.onrender.com
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   Neon DB       │  ← Database (PostgreSQL)
│   (Database)    │     postgresql://...
└─────────────────┘
```

### Tại sao cần Backend API riêng?

1. **Netlify chỉ hỗ trợ static sites**
   - Không thể chạy server code trực tiếp
   - Cần backend API riêng để xử lý database

2. **Bảo mật**
   - Database credentials không được expose trong frontend
   - Backend API xử lý authentication và authorization

3. **Performance**
   - Backend API có thể cache, optimize queries
   - Database connection pooling

4. **Scalability**
   - Backend API có thể scale độc lập
   - Database có thể được optimize riêng

---

## 📝 Environment Variables

### Backend API cần:

```env
DATABASE_URL=postgresql://...          # Database connection
PORT=3002                              # Server port
ALLOWED_ORIGINS=https://...            # CORS allowed origins
NODE_ENV=production                    # Environment
```

### Frontend cần:

```env
VITE_API_URL=https://quiz-api.onrender.com  # Backend API URL
```

---

## 🔧 Cách chạy Backend API

### Local Development

```bash
# Chạy backend API
npm run server

# Backend API sẽ chạy tại: http://localhost:3002
```

### Production Deployment

1. **Deploy lên Railway/Render/Fly.io**
   - Set environment variables
   - Backend API sẽ tự động start

2. **Set VITE_API_URL trong Netlify**
   - Frontend sẽ gọi backend API qua URL này

---

## ❓ Câu hỏi thường gặp

### 1. Tại sao không lưu dữ liệu trực tiếp từ Frontend?

**Trả lời:**
- Frontend chạy trên browser, không thể kết nối trực tiếp đến database
- Database credentials sẽ bị expose (bảo mật kém)
- Backend API xử lý validation, security, và business logic

### 2. Backend API có thể làm gì?

**Trả lời:**
- Lưu trữ dữ liệu vào database
- Xử lý business logic
- Authentication và authorization
- Validation dữ liệu
- Tracking và analytics
- API rate limiting
- Caching

### 3. Frontend có thể làm gì?

**Trả lời:**
- Hiển thị UI
- Xử lý user interactions
- Gọi API để lấy/gửi dữ liệu
- Local storage (temporary)
- Client-side validation

### 4. Database là gì?

**Trả lời:**
- Database là nơi lưu trữ dữ liệu lâu dài
- Trong project này dùng PostgreSQL (Neon)
- Database lưu: leaderboard, tracking data, user data

---

## 📚 Tài liệu tham khảo

- `server/README.md` - Backend API documentation
- `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy backend
- `NETLIFY_TEST_REPORT.md` - Test report

---

## 🎯 Tóm tắt

**Backend API** là:
- ✅ Server xử lý logic và lưu trữ dữ liệu
- ✅ Cung cấp API endpoints để Frontend giao tiếp
- ✅ Kết nối với Database để lưu/lấy dữ liệu
- ✅ Xử lý security, validation, và business logic

**Trong project này:**
- Frontend: Netlify (https://leafy-sunflower-6cf24d.netlify.app)
- Backend API: Railway/Render/Fly.io (chưa deploy)
- Database: Neon PostgreSQL

**Next steps:**
1. Deploy Backend API lên Railway/Render/Fly.io
2. Set VITE_API_URL trong Netlify Dashboard
3. Test lại ứng dụng

