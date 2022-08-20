import { NextRequest, NextResponse } from 'next/server'
import { JWT_SECRET } from '../libs/config'

const logoutMiddleware = (req: NextRequest) => {
  const token = req.cookies.get('Authorization')
  if (!token || !JWT_SECRET) {
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export default logoutMiddleware
