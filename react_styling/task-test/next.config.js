/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'example.com',
      'picsum.photos'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = false;
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        events: false,
      };
    }
    return config;
  },
  optimizeFonts: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https://accounts.google.com https://*.cloudinary.com https://api.cloudinary.com wss://chat.stream-io-api.com https://chat.stream-io-api.com https://*.stream-io-api.com",
              "img-src 'self' data: blob: https://*.cloudinary.com https://res.cloudinary.com",
              "media-src 'self' https://*.cloudinary.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https://accounts.google.com"
            ].join('; ')
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig
