-- Tạo bảng leaderboard để lưu kết quả trắc nghiệm
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  summary TEXT NOT NULL,
  analysis_title VARCHAR(500),
  analysis_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tối ưu query theo score và thời gian
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Tạo index composite để query top scores nhanh hơn
CREATE INDEX IF NOT EXISTS idx_leaderboard_score_created ON leaderboard(score DESC, created_at DESC);

-- Tạo bảng quiz_tracking để lưu thông tin GPS và IP tracking
CREATE TABLE IF NOT EXISTS quiz_tracking (
  id SERIAL PRIMARY KEY,
  leaderboard_id INTEGER REFERENCES leaderboard(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tối ưu query theo IP và thời gian
CREATE INDEX IF NOT EXISTS idx_quiz_tracking_ip_address ON quiz_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_quiz_tracking_created_at ON quiz_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_tracking_leaderboard_id ON quiz_tracking(leaderboard_id);
