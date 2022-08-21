import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://e2a56cc92f044311a7eacdcf4ffd2f1c@o218910.ingest.sentry.io/6647019',
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
})
