/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['objectstorage.ap-chuncheon-1.oraclecloud.com', 'imgnews.naver.net'],
  },
};

module.exports = nextConfig;
