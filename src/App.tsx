import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Game from './pages/Game'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-6xl mx-auto px-6 py-4 flex h-14 items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
              PSY-QUIZ
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/leaderboard" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Bảng xếp hạng
              </Link>
            </div>
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
