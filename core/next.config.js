const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      allowFutureImage: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.foody.vn',
        },
      ],
    },
  },
}

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
