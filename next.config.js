
// Generate build stamp for PWA versioning
const buildStamp = process.env.NEXT_PUBLIC_BUILD || 
  `${new Date().toISOString().slice(0, 16).replace('T', '-')}-${Math.random().toString(36).slice(2, 8)}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD: buildStamp,
  },
  webpack: (config, { dev, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_BUILD': JSON.stringify(buildStamp),
      })
    );
    return config;
  },
  // Set proper headers for service worker
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;