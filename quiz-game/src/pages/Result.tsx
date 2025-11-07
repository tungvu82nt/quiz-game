import { useLocation, Link } from 'react-router-dom'
import type { Score, AnalysisResult } from '../types'
import { parseNarrativeSummary } from '../utils/analysisFormat'

export default function Result() {
  const location = useLocation()
  const state = (location.state || {}) as { score?: Score; summary?: { label: string; details: string }; analysis?: AnalysisResult | null }
  const score = state.score
  const summary = state.summary
  const analysis = state.analysis

  const share = async () => {
    const text = `Kết quả PSY-QUIZ: ${summary?.details}`
    const url = window.location.origin
    // Web Share API nếu hỗ trợ
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PSY-QUIZ', text, url })
        alert('Đã chia sẻ kết quả!')
        return
      } catch {}
    }
    // fallback: copy vào clipboard
    await navigator.clipboard.writeText(`${text} \n ${url}`)
    alert('Đã sao chép kết quả vào clipboard!')
  }

  if (!score || !summary) {
    return (
      <div className="container">
        <h2>Không có dữ liệu kết quả</h2>
        <Link to="/">Quay lại làm trắc nghiệm</Link>
      </div>
    )
  }

  const parts = analysis?.summary ? parseNarrativeSummary(analysis.summary) : null

  return (
    <div className="container">
      <h1>Kết quả</h1>
      {/* Bỏ hiển thị đoạn tóm tắt điểm tổng (p.summary) theo yêu cầu */}
      {/* Bỏ hiển thị khối điểm (score-grid) theo yêu cầu */}
      {analysis && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2 style={{ margin: 0 }}>{analysis.title ?? 'Phân tích AI'}</h2>
          {parts ? (
            <div className="analysis-grid">
              {parts.inside && (
                <div className="analysis-card">
                  <div className="analysis-label">Bên trong (Tư duy/Cảm xúc)</div>
                  <div className="analysis-text">{parts.inside}</div>
                </div>
              )}
              {parts.outside && (
                <div className="analysis-card">
                  <div className="analysis-label">Bên ngoài (Hành vi)</div>
                  <div className="analysis-text">{parts.outside}</div>
                </div>
              )}
              {parts.hypothesis && (
                <div className="analysis-card">
                  <div className="analysis-label">Giả thuyết tổng thể</div>
                  <div className="analysis-text">{parts.hypothesis}</div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ marginTop: 8 }} className="summary">
              {analysis.summary}
            </p>
          )}
          {parts?.disclaimer && (
            <p className="analysis-disclaimer">{parts.disclaimer}</p>
          )}
          {/* Bỏ hiển thị danh sách traits dạng ul/li theo yêu cầu */}
        </div>
      )}
      <div className="actions">
        <button className="primary" onClick={share}>Chia sẻ kết quả</button>
        <Link to="/leaderboard" className="link">Xem bảng xếp hạng</Link>
        <Link to="/" className="link">Làm lại</Link>
      </div>
    </div>
  )
}
