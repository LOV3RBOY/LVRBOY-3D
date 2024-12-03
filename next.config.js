const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle node canvas in SSR
    if (!isServer) {
      config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    }

    // Optimize Three.js and React chunks
    config.module.rules.push({
      test: /three[\/\\]examples[\/\\]jsm/,
      sideEffects: false
    });

    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'named',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000,
        cacheGroups: {
          default: false,
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|next|@next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          three: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three-vendor',
            priority: 30,
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          }
        }
      }
    };

    return config;
  },
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vimeocdn.com'
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com'
      }
    ]
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' player.vimeo.com *.vimeo.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' blob: data: *.vimeo.com *.vimeocdn.com fonts.googleapis.com fonts.gstatic.com",
              "frame-src 'self' player.vimeo.com *.vimeo.com",
              "img-src 'self' data: blob: *.vimeocdn.com",
              "media-src 'self' blob: data: *.vimeo.com *.vimeocdn.com",
              "worker-src 'self' blob:",
              "child-src blob: *.vimeo.com",
              "object-src 'none'"
            ].join('; ')
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig) 