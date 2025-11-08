import { useState, useEffect } from 'react'

export type GeolocationData = {
  latitude: number
  longitude: number
  accuracy: number
} | null

export type GeolocationError = {
  code: number
  message: string
} | null

/**
 * Custom hook để lấy GPS location từ browser
 * Yêu cầu quyền truy cập GPS từ user
 * Trả về null nếu user từ chối hoặc không hỗ trợ GPS
 */
export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData>(null)
  const [error, setError] = useState<GeolocationError>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra browser có hỗ trợ Geolocation API không
    if (!navigator.geolocation) {
      setError({
        code: -1,
        message: 'Geolocation is not supported by this browser',
      })
      setLoading(false)
      return
    }

    // Yêu cầu quyền truy cập GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Lấy GPS thành công
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setError(null)
        setLoading(false)
      },
      (err) => {
        // User từ chối hoặc có lỗi
        setError({
          code: err.code,
          message: err.message,
        })
        setLocation(null)
        setLoading(false)
      },
      {
        enableHighAccuracy: true, // Sử dụng GPS accuracy cao hơn
        timeout: 10000, // Timeout 10 giây
        maximumAge: 0, // Không cache, lấy vị trí mới nhất
      }
    )
  }, [])

  return { location, error, loading }
}

