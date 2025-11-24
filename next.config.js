/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude merch-mind-planner reference folder from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/merch-mind-planner/**', '**/node_modules/**'],
    };
    return config;
  },
}

module.exports = nextConfig;
