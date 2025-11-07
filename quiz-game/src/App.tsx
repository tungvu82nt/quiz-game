import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Game from './pages/Game'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <nav className="topbar">
          <Link to="/" className="brand">PSY-QUIZ</Link>
          <div className="nav-actions">
            <Link to="/leaderboard">Bảng xếp hạng</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
