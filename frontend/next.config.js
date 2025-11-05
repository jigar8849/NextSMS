/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: './',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
