/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  transpilePackages: ['@multiversx/sdk-dapp'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding', {
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate'
    });

    return config;
  },
  // This configuration will proxy all requests from /api/* to the Next.js server running on port 13000
  // To be removed in production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:13000'}/api/:path*`
      }
    ];
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
