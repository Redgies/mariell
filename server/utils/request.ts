import type { H3Event } from 'h3'

export function getClientIp(event: H3Event): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  const real = getHeader(event, 'x-real-ip')
  if (real) return real.trim()
  return event.node.req.socket?.remoteAddress || 'unknown'
}
