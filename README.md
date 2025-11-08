# PSY-QUIZ — Trắc nghiệm tâm lý vui nhộn (Game-based)

Môi trường staging/dev đã khởi chạy bằng Vite. Ứng dụng đọc dữ liệu từ file markdown `../quiz-tam-ly-vui-nhon.md`, parse thành câu hỏi trắc nghiệm, thêm các câu kiểu điền khuyết và kéo-thả mẫu, tính điểm tự động, có hiệu ứng âm thanh/hình ảnh, leaderboard và chia sẻ kết quả.

## Cách chạy

1. Yêu cầu Node.js >= 18.
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy migration database (chỉ cần chạy một lần):
   ```bash
   npm run db:migrate
   ```
4. Trong thư mục `quiz-game/`:
   - **Chạy cả frontend và backend:** `npm run dev:all` (khuyến nghị)
   - **Chỉ frontend:** `npm run dev` (Vite server trên port 5173)
   - **Chỉ backend:** `npm run server` (API server trên port 3001)
   - **Backend với watch mode:** `npm run dev:server`
   - Build: `npm run build`
   - Preview build: `npm run preview`
   - Test: `npm run test`

## Cấu hình AI phân tích

Tạo file `.env` trong thư mục `quiz-game/` dựa theo `.env.example`:

```
VITE_ANALYSIS_API_URL=https://your-analysis-api.example.com/analyze
VITE_ANALYSIS_API_KEY=your_api_key_here
```

Ứng dụng sẽ gửi payload gồm `answers` (map câu hỏi -> A/B/C/D) và `score` (tổng điểm theo nhóm) tới API này để nhận kết quả phân tích `title`, `summary` và `traits` (tuỳ chọn). Nếu chưa cấu hình, hệ thống sẽ hiển thị phân tích sơ bộ.

## Kỹ thuật chính

- Vite + React + TypeScript
- Đọc markdown bằng import raw: `import quizMd from '../../quiz-tam-ly-vui-nhon.md?raw'`
- Parser tuỳ biến tại `src/utils/markdownParser.ts`
- Giao diện responsive, theme vui nhộn, hiệu ứng tương tác
- Âm thanh sử dụng WebAudio (`src/hooks/useAudio.ts`) — không cần assets
- Lưu kết quả vào **Neon PostgreSQL** qua REST API (`src/hooks/useLeaderboard.ts`)
- Fallback về localStorage nếu API không khả dụng
- Chia sẻ kết quả: Web Share API, fallback copy clipboard
- Unit tests bằng Vitest (parser & scoring)
 - Prompt AI lưu riêng tại `src/prompts/psychometricExpert.ts` để dễ bảo trì (có thể chỉnh sửa nội dung prompt tại đây)

## Bảo mật & Hiệu suất

- Không render HTML từ markdown, hiển thị text thuần để tránh XSS
- Truy cập file nằm ngoài project root được kiểm soát bằng `server.fs.allow` trong `vite.config.ts`
- Parse một lần, dùng memoization để giảm tính toán lại

## Mở rộng

- Có thể thay thế parser bằng `remark`/`markdown-it` nếu format phức tạp hơn
- Backend API đã được tích hợp với Neon PostgreSQL để lưu trữ kết quả

## Cấu trúc

- `src/pages/` — Game, Result, Leaderboard
- `src/components/` — Các thành phần UI, câu hỏi MCQ/Fill/Drag
- `src/utils/` — Parser markdown, tests
- `src/game/` — Tính điểm, tests
- `src/hooks/` — Audio, Leaderboard
- `server/` — Backend API server với Express
  - `server/index.ts` — Express server và API endpoints
  - `server/db.ts` — Database connection pool
  - `server/schema.sql` — Database schema
  - `server/migrate.ts` — Migration script

## Definition of Done (DoD)

- Source code hoàn chỉnh, chạy được dev server
- Tài liệu README này
- Có demo staging (Vite dev server)
- Có unit tests cho parser & scoring
