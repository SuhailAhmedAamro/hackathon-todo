/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,  // Disable SWC, use Babel instead
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig
