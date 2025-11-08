# Hướng dẫn Setup Netlify Environment Variables (Manual)

## Cách 1: Sử dụng Netlify Dashboard

### Bước 1: Đăng nhập Netlify

1. Truy cập: https://app.netlify.com
2. Đăng nhập vào tài khoản của bạn

### Bước 2: Chọn Site

1. Tìm và click vào site: `leafy-sunflower-6cf24d`
2. Hoặc truy cập trực tiếp: https://app.netlify.com/sites/leafy-sunflower-6cf24d

### Bước 3: Vào Environment Variables

1. Click vào **Site settings** (hoặc icon ⚙️)
2. Vào **Environment variables** trong menu bên trái
3. Click **Add a variable**

### Bước 4: Thêm các Environment Variables

Thêm các biến sau một cách thủ công:

#### 1. VITE_API_URL
- **Key**: `VITE_API_URL`
- **Value**: `https://quiz-game-production-a421.up.railway.app`
- **Scopes**: Chọn **All scopes** (hoặc **Production**)

#### 2. VITE_ANALYSIS_API_URL
- **Key**: `VITE_ANALYSIS_API_URL`
- **Value**: `https://api.minimax.chat/v1/`
- **Scopes**: **All scopes**

#### 3. VITE_ANALYSIS_API_KEY
- **Key**: `VITE_ANALYSIS_API_KEY`
- **Value**: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJrZWx2aW5sZWUiLCJVc2VyTmFtZSI6ImtlbHZpbmxlZSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg1NzU1OTAzNzU1ODIxOTA4IiwiUGhvbmUiOiIxMzE1MDYyNjk2OCIsIkdyb3VwSUQiOiIxOTg1NzU1OTAzNzQ3NDMzMzAwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMTEtMDYgMDM6MTQ6NTMiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.XngHDNeZ9bl-WvD9nfEMF-JGiLUXS3K_zoIql_MQ332ziFuGOZV6QktHsocZOvn4WjaqyzYFXIl5_fPc8ZBrj78f4ebd7v_yMDiIOJWPm7GvyIp8XZeajJRqQ7A-_PLt1MGBDbs4uNjkpFgEuUn76NkgGz4IZJHmMF1fLbdEpvvERROSDhi39Ca-Ozv1IxgnjCQDsX7uipvJsXQlCsz0zl61vmV-S0RxAnjdSmZTjBMuZNxYgoijmZidQVQhIRh2BuLbTHxgtQvTcus6K7wdXzHQb2dbJ1Q7mvOcBW4Z7KXumgID1RQR76nVTLKaEgLOfqAFEcqyXYq_8OWkGVqcUQ`
- **Scopes**: **All scopes**

#### 4. VITE_ANALYSIS_API_PATH
- **Key**: `VITE_ANALYSIS_API_PATH`
- **Value**: `chat/completions`
- **Scopes**: **All scopes**

#### 5. VITE_ANALYSIS_MODEL
- **Key**: `VITE_ANALYSIS_MODEL`
- **Value**: `MiniMax-M2`
- **Scopes**: **All scopes**

#### 6. VITE_PROMPT_STYLE
- **Key**: `VITE_PROMPT_STYLE`
- **Value**: `narrative`
- **Scopes**: **All scopes**

#### 7. VITE_ANALYSIS_USE_MOCK
- **Key**: `VITE_ANALYSIS_USE_MOCK`
- **Value**: `1`
- **Scopes**: **All scopes**

### Bước 5: Save và Redeploy

1. Click **Save** sau khi thêm tất cả các biến
2. Vào **Deploys** tab
3. Click **Trigger deploy** > **Clear cache and deploy site**
4. Đợi deployment hoàn tất (1-2 phút)

### Bước 6: Test lại

1. Mở: https://leafy-sunflower-6cf24d.netlify.app
2. Mở Developer Console (F12)
3. Kiểm tra Console logs:
   - Should see: "Response Status: 200"
   - Should see: "Content-Type: application/json"
   - Should see: "Successfully fetched leaderboard"
4. Kiểm tra Network tab:
   - Request phải trỏ đến: `https://quiz-game-production-a421.up.railway.app/api/leaderboard`
   - Response phải là JSON

---

## Cách 2: Sử dụng Netlify CLI

### Bước 1: Cài đặt Netlify CLI

```bash
npm install -g netlify-cli
```

### Bước 2: Đăng nhập

```bash
netlify login
```

### Bước 3: Set Environment Variables

```bash
# Set VITE_API_URL
netlify env:set VITE_API_URL "https://quiz-game-production-a421.up.railway.app"

# Set các biến khác
netlify env:set VITE_ANALYSIS_API_URL "https://api.minimax.chat/v1/"
netlify env:set VITE_ANALYSIS_API_KEY "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJrZWx2aW5sZWUiLCJVc2VyTmFtZSI6ImtlbHZpbmxlZSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTg1NzU1OTAzNzU1ODIxOTA4IiwiUGhvbmUiOiIxMzE1MDYyNjk2OCIsIkdyb3VwSUQiOiIxOTg1NzU1OTAzNzQ3NDMzMzAwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjUtMTEtMDYgMDM6MTQ6NTMiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.XngHDNeZ9bl-WvD9nfEMF-JGiLUXS3K_zoIql_MQ332ziFuGOZV6QktHsocZOvn4WjaqyzYFXIl5_fPc8ZBrj78f4ebd7v_yMDiIOJWPm7GvyIp8XZeajJRqQ7A-_PLt1MGBDbs4uNjkpFgEuUn76NkgGz4IZJHmMF1fLbdEpvvERROSDhi39Ca-Ozv1IxgnjCQDsX7uipvJsXQlCsz0zl61vmV-S0RxAnjdSmZTjBMuZNxYgoijmZidQVQhIRh2BuLbTHxgtQvTcus6K7wdXzHQb2dbJ1Q7mvOcBW4Z7KXumgID1RQR76nVTLKaEgLOfqAFEcqyXYq_8OWkGVqcUQ"
netlify env:set VITE_ANALYSIS_API_PATH "chat/completions"
netlify env:set VITE_ANALYSIS_MODEL "MiniMax-M2"
netlify env:set VITE_PROMPT_STYLE "narrative"
netlify env:set VITE_ANALYSIS_USE_MOCK "1"
```

### Bước 4: Trigger Redeploy

```bash
netlify deploy --prod
```

---

## Troubleshooting

### Lỗi: API token không có quyền

**Giải pháp**: Sử dụng cách 1 (Manual setup) hoặc tạo API token mới với đầy đủ quyền

### Lỗi: Site ID không đúng

**Giải pháp**: 
- Kiểm tra Site ID trong Netlify Dashboard
- Site ID có thể là: `leafy-sunflower-6cf24d` hoặc UUID khác
- Kiểm tra URL: `https://app.netlify.com/sites/<site-id>`

### Lỗi: Environment variables không có hiệu lực

**Giải pháp**:
- Đảm bảo đã trigger redeploy sau khi set environment variables
- Clear cache và redeploy
- Kiểm tra trong build logs xem environment variables có được inject không

---

## Quick Reference

### Environment Variables cần set:

```
VITE_API_URL=https://quiz-game-production-a421.up.railway.app
VITE_ANALYSIS_API_URL=https://api.minimax.chat/v1/
VITE_ANALYSIS_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ANALYSIS_API_PATH=chat/completions
VITE_ANALYSIS_MODEL=MiniMax-M2
VITE_PROMPT_STYLE=narrative
VITE_ANALYSIS_USE_MOCK=1
```

### Netlify Site:
- Site URL: https://leafy-sunflower-6cf24d.netlify.app
- Dashboard: https://app.netlify.com/sites/leafy-sunflower-6cf24d

### Railway Backend:
- Backend URL: https://quiz-game-production-a421.up.railway.app

