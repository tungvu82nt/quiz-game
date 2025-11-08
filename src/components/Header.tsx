import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">PSY-QUIZ</Link>
      <nav className="nav">
        <Link to="/leaderboard">Bảng xếp hạng</Link>
      </nav>
    </header>
  )
}
