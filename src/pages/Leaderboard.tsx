import { useLeaderboard } from '../hooks/useLeaderboard'
import { Link } from 'react-router-dom'

export default function Leaderboard() {
  const { board, loading, error } = useLeaderboard()
  
  return (
    <div className="container">
      <h1>Bảng xếp hạng</h1>
      {error && (
        <div style={{ padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', marginBottom: '16px', color: '#856404' }}>
          ⚠️ {error}
        </div>
      )}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : board.length === 0 ? (
        <p>Chưa có dữ liệu. Hãy hoàn thành bài trắc nghiệm để ghi danh!</p>
      ) : (
        <ul className="leaderboard">
          {board.map((item, idx) => (
            <li key={idx} className="leader-item">
              <span className="rank">#{idx + 1}</span>
              <span className="name">{item.name}</span>
              <span className="score">{item.score}đ</span>
              <span className="summary">
                {item.analysisTitle ? <strong>{item.analysisTitle}</strong> : null}
                {item.analysisSummary ? (
                  <div className="analysis-text" style={{ marginTop: 4 }}>{item.analysisSummary}</div>
                ) : (
                  item.summary
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="actions">
        <Link to="/">Quay lại</Link>
      </div>
    </div>
  )
}
