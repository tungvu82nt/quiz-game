# Neon REST API Documentation

## Tổng quan

Neon cung cấp 2 cách để truy cập database:

1. **PostgreSQL Connection** (Đang sử dụng)
   - Sử dụng `pg` package
   - SQL queries trực tiếp
   - Connection pooling
   - Đã được implement trong project

2. **REST API** (Alternative)
   - HTTP requests
   - Không cần connection pooling
   - Phù hợp cho serverless environments
   - Cần API key

## REST API Endpoint

```
https://ep-round-wind-a1ndxq3a.apirest.ap-southeast-1.aws.neon.tech/neondb/rest/v1
```

## Cấu hình

### 1. Lấy API Key

1. Đăng nhập vào [Neon Dashboard](https://console.neon.tech)
2. Chọn project của bạn
3. Vào **Settings** > **API Keys**
4. Tạo API key mới hoặc sử dụng key hiện có

### 2. Set Environment Variables

Thêm vào `.env`:

```env
NEON_REST_API_URL=https://ep-round-wind-a1ndxq3a.apirest.ap-southeast-1.aws.neon.tech/neondb/rest/v1
NEON_REST_API_KEY=your_api_key_here
```

## Sử dụng REST API

### Ví dụ: GET request

```typescript
const response = await fetch(
  `${NEON_REST_API_URL}/leaderboard?order=score.desc&limit=50`,
  {
    headers: {
      'apikey': NEON_REST_API_KEY,
      'Authorization': `Bearer ${NEON_REST_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
)

const data = await response.json()
```

### Ví dụ: POST request

```typescript
const response = await fetch(
  `${NEON_REST_API_URL}/leaderboard`,
  {
    method: 'POST',
    headers: {
      'apikey': NEON_REST_API_KEY,
      'Authorization': `Bearer ${NEON_REST_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation', // Return inserted row
    },
    body: JSON.stringify({
      name: 'Test User',
      score: 10,
      summary: 'Test summary',
      analysis_title: 'Test title',
      analysis_summary: 'Test summary',
    }),
  }
)

const data = await response.json()
```

### Ví dụ: Query với filters

```typescript
// Get top 10 scores
const response = await fetch(
  `${NEON_REST_API_URL}/leaderboard?score=gt.5&order=score.desc&limit=10`,
  {
    headers: {
      'apikey': NEON_REST_API_KEY,
      'Authorization': `Bearer ${NEON_REST_API_KEY}`,
    },
  }
)
```

## So sánh PostgreSQL vs REST API

### PostgreSQL Connection (Hiện tại)

**Ưu điểm:**
- ✅ SQL queries linh hoạt
- ✅ Transactions support
- ✅ Connection pooling
- ✅ Đã được implement
- ✅ Performance tốt cho complex queries

**Nhược điểm:**
- ❌ Cần maintain connection pool
- ❌ Có thể gặp vấn đề với serverless (cold starts)
- ❌ Cần manage connection lifecycle

### REST API

**Ưu điểm:**
- ✅ Không cần connection pool
- ✅ Phù hợp cho serverless (Vercel, Netlify Functions)
- ✅ Đơn giản hơn (chỉ cần HTTP requests)
- ✅ Auto-scaling

**Nhược điểm:**
- ❌ Limited query capabilities
- ❌ Không support transactions
- ❌ Cần refactor code
- ❌ Latency cao hơn (HTTP overhead)

## Khi nào nên dùng REST API?

1. **Serverless environments** (Vercel, Netlify Functions)
2. **Simple queries** (CRUD operations)
3. **Không cần transactions**
4. **Không cần complex joins**

## Khi nào nên dùng PostgreSQL Connection?

1. **Traditional server** (Express, FastAPI)
2. **Complex queries** (joins, subqueries)
3. **Transactions** (atomic operations)
4. **Performance critical** applications

## Migration từ PostgreSQL sang REST API

Nếu muốn chuyển sang REST API, cần:

1. **Tạo file mới**: `server/db-rest.ts`
   ```typescript
   const NEON_REST_API_URL = process.env.NEON_REST_API_URL
   const NEON_REST_API_KEY = process.env.NEON_REST_API_KEY
   
   export async function queryREST(table: string, options?: {
     method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
     filters?: Record<string, any>
     order?: string
     limit?: number
     data?: any
   }) {
     // Implementation
   }
   ```

2. **Refactor server/index.ts**
   - Thay `query()` bằng `queryREST()`
   - Convert SQL queries sang REST API calls

3. **Update environment variables**
   - Set `NEON_REST_API_URL` và `NEON_REST_API_KEY`
   - Có thể giữ `DATABASE_URL` để fallback

## Tài liệu tham khảo

- [Neon REST API Docs](https://neon.tech/docs/api/rest)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Neon Dashboard](https://console.neon.tech)

## Kết luận

Hiện tại project đang sử dụng **PostgreSQL Connection** và hoạt động tốt. **REST API** là một lựa chọn thay thế nếu:

- Muốn deploy lên serverless platform (Netlify Functions, Vercel)
- Muốn đơn giản hóa code (không cần connection pool)
- Chỉ cần CRUD operations đơn giản

Nếu cần **complex queries, transactions, hoặc performance**, nên tiếp tục dùng **PostgreSQL Connection**.

