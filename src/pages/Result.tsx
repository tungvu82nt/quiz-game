import { useLocation, Link } from 'react-router-dom'
import type { Score, AnalysisResult } from '../types'
import { parseNarrativeSummary } from '../utils/analysisFormat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
      } catch (err) {
        // User cancelled or share failed, continue to clipboard fallback
        console.log('Share cancelled or failed:', err)
      }
    }
    // fallback: copy vào clipboard
    await navigator.clipboard.writeText(`${text} \n ${url}`)
    alert('Đã sao chép kết quả vào clipboard!')
  }

  if (!score || !summary) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Không có dữ liệu kết quả</h2>
        <Link to="/" className="text-primary hover:underline">Quay lại làm trắc nghiệm</Link>
      </div>
    )
  }

  const parts = analysis?.summary ? parseNarrativeSummary(analysis.summary) : null

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Kết quả</h1>
      {/* Bỏ hiển thị đoạn tóm tắt điểm tổng (p.summary) theo yêu cầu */}
      {/* Bỏ hiển thị khối điểm (score-grid) theo yêu cầu */}
      {analysis && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{analysis.title ?? 'Phân tích AI'}</CardTitle>
          </CardHeader>
          <CardContent>
            {parts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {parts.inside && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-bold text-lg text-primary">Bên trong (Tư duy/Cảm xúc)</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{parts.inside}</p>
                    </CardContent>
                  </Card>
                )}
                {parts.outside && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <h3 className="font-bold text-lg text-primary">Bên ngoài (Hành vi)</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{parts.outside}</p>
                    </CardContent>
                  </Card>
                )}
                {parts.hypothesis && (
                  <Card className="bg-muted/50 md:col-span-2 lg:col-span-1">
                    <CardHeader className="pb-3">
                      <h3 className="font-bold text-lg text-primary">Giả thuyết tổng thể</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{parts.hypothesis}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-line">{analysis.summary}</p>
            )}
            {parts?.disclaimer && (
              <p className="mt-4 text-sm text-muted-foreground italic">{parts.disclaimer}</p>
            )}
            {/* Bỏ hiển thị danh sách traits dạng ul/li theo yêu cầu */}
          </CardContent>
        </Card>
      )}
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        <Button 
          variant="outline" 
          onClick={share}
          className="transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Chia sẻ kết quả
        </Button>
        <Button 
          variant="outline" 
          asChild
          className="transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Link to="/">Làm lại</Link>
        </Button>
      </div>
    </div>
  )
}
