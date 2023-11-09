/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['objectstorage.ap-chuncheon-1.oraclecloud.com', 'imgnews.naver.net'],
  },
  webpack: (config, { isServer, dev }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

module.exports = nextConfig;
