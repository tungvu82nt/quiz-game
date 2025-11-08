import type { Request, Response, NextFunction } from 'express'

/**
 * Middleware để extract IP address từ request
 * Hỗ trợ:
 * - X-Forwarded-For header (cho proxy/load balancer)
 * - X-Real-IP header
 * - req.ip (từ Express trust proxy)
 * - req.socket.remoteAddress (fallback)
 * Hỗ trợ cả IPv4 và IPv6
 */
export function getClientIp(req: Request): string {
  // 1. Kiểm tra X-Forwarded-For header (cho proxy/load balancer)
  // Format: "client, proxy1, proxy2"
  const forwardedFor = req.headers['x-forwarded-for']
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
    // Lấy IP đầu tiên (client IP thực sự)
    const clientIp = ips.split(',')[0].trim()
    if (clientIp) {
      return clientIp
    }
  }

  // 2. Kiểm tra X-Real-IP header
  const realIp = req.headers['x-real-ip']
  if (realIp) {
    const ip = Array.isArray(realIp) ? realIp[0] : realIp
    if (ip) {
      return ip.trim()
    }
  }

  // 3. Sử dụng req.ip (nếu Express trust proxy được bật)
  if (req.ip && req.ip !== '::1' && req.ip !== '127.0.0.1') {
    return req.ip
  }

  // 4. Fallback về req.socket.remoteAddress
  const remoteAddress = req.socket.remoteAddress
  if (remoteAddress) {
    // Xử lý IPv6 mapped IPv4: "::ffff:192.168.1.1" -> "192.168.1.1"
    if (remoteAddress.startsWith('::ffff:')) {
      return remoteAddress.substring(7)
    }
    return remoteAddress
  }

  // 5. Fallback cuối cùng
  return 'unknown'
}

/**
 * Middleware function để attach IP address vào request object
 * Sử dụng: app.use(ipTrackingMiddleware)
 */
export function ipTrackingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Attach IP vào request object
  ;(req as Request & { clientIp: string }).clientIp = getClientIp(req)
  next()
}

