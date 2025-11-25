/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable Turbopack (default in Next.js 16)
  turbopack: {},
}

module.exports = nextConfig;
