// middleware.ts
import { NextMiddleware } from 'next/server'
import type { NextRequest } from 'next/server'
import logoutMiddleware from './middlewares/logout'
import loginMiddleware from './middlewares/login'

export const middleware: NextMiddleware = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/logout')) {
    return logoutMiddleware(request)
  }
  if (request.nextUrl.pathname.startsWith('/login')) {
    return loginMiddleware(request)
  }
}
