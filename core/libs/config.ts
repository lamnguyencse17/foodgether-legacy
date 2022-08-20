export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.JWT_SECRET || '12345'
export const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
export const MOCK_PRISMA = process.env.MOCK_PRISMA === 'true'
