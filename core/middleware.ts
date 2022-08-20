// middleware.ts
import { NextMiddleware, NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logoutMiddleware from './middlewares/logout'

export const middleware: NextMiddleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/logout')) {
    return logoutMiddleware(request)
  }
}
