/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 20
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'lib',
          priority: 30
        }
      }
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  images: {
    domains: ['i.vimeocdn.com', 'player.vimeo.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' player.vimeo.com",
              "connect-src 'self' blob: data:",
              "frame-src player.vimeo.com",
              "img-src 'self' data: blob: *.vimeocdn.com",
              "media-src 'self' blob: data:",
              "style-src 'self' 'unsafe-inline'",
              "worker-src 'self' blob:"
            ].join('; ')
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 