import { NextRequest, NextResponse } from 'next/server'
import { JWT_SECRET } from '../libs/config'
import jwt from '@tsndr/cloudflare-worker-jwt'

const loginMiddleware = async (req: NextRequest) => {
  const token = req.cookies.get('Authorization')
  if (!token) {
    return NextResponse.next()
  }
  const isValid = await jwt.verify(token, JWT_SECRET)
  if (!isValid) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', req.url))
}

export default loginMiddleware
