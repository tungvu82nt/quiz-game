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

