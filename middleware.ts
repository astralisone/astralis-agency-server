import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || ""
  const response = NextResponse.next()

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Max-Age", "86400")
    response.headers.set("Cross-Origin-Embedder-Policy", "credentialless")
    response.headers.set("Cross-Origin-Resource-Policy", "cross-origin")
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
  }

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/api/paypal/:path*",
  ],
}