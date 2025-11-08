# Railway Deployment Checklist

## Pre-Deployment

- [x] Code đã push lên GitHub
- [x] Backend server chạy được local
- [x] Database migration đã test
- [x] Environment variables đã chuẩn bị

## Railway Configuration

### Project Setup

- [x] Railway project đã được tạo
- [x] GitHub repository đã được connect
- [x] Domain đã được assign: `quiz-game-production-a421.up.railway.app`

### Environment Variables

- [ ] `DATABASE_URL` = `postgresql://neondb_owner:npg_h4dqyPIBga8T@ep-round-wind-a1ndxq3a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- [ ] `PORT` = `3002` (hoặc để Railway tự động assign)
- [ ] `ALLOWED_ORIGINS` = `https://leafy-sunflower-6cf24d.netlify.app`
- [ ] `NODE_ENV` = `production`

### Deploy Settings

- [ ] Start Command: `npm run server`
- [ ] Build Command: `npm install` (hoặc để trống)
- [ ] Healthcheck Path: `/health`
- [ ] Healthcheck Timeout: `100` seconds

## Testing

### Backend API Tests

- [ ] Test health endpoint: `GET /health`
- [ ] Test leaderboard GET: `GET /api/leaderboard`
- [ ] Test leaderboard POST: `POST /api/leaderboard`
- [ ] Test CORS headers
- [ ] Test database connection
- [ ] Test tracking endpoints

### Script Tests

- [ ] `node scripts/test-api.js https://quiz-game-production-a421.up.railway.app`
- [ ] `node scripts/check-deployment.js https://quiz-game-production-a421.up.railway.app`

## Post-Deployment

### Netlify Setup

- [ ] Set `VITE_API_URL` = `https://quiz-game-production-a421.up.railway.app`
- [ ] Trigger Netlify redeploy
- [ ] Test Netlify frontend với Railway backend

### End-to-End Testing

- [ ] Test frontend load leaderboard
- [ ] Test submit score
- [ ] Test GPS tracking
- [ ] Test leaderboard display
- [ ] Test console không có errors

## Troubleshooting

Nếu gặp vấn đề:

- [ ] Kiểm tra Railway logs
- [ ] Kiểm tra environment variables
- [ ] Kiểm tra database connection
- [ ] Kiểm tra CORS configuration
- [ ] Kiểm tra PORT assignment

## Notes

- Railway URL: https://quiz-game-production-a421.up.railway.app
- Frontend URL: https://leafy-sunflower-6cf24d.netlify.app
- Database: Neon PostgreSQL

