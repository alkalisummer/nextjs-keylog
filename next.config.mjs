/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'objectstorage.ap-chuncheon-1.oraclecloud.com', pathname: '/**' },
      { protocol: 'https', hostname: 'imgnews.naver.net', pathname: '/**' },
      { protocol: 'http', hostname: 'imgnews.naver.net', pathname: '/**' },
      { protocol: 'https', hostname: 'imgnews.pstatic.net', pathname: '/**' },
      { protocol: 'http', hostname: 'imgnews.pstatic.net', pathname: '/**' },
      { protocol: 'http', hostname: 'simg.pstatic.net', pathname: '/**' },
      { protocol: 'https', hostname: 'simg.pstatic.net', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'https', hostname: 'keylog.dev', pathname: '/**' },
    ],
  },

  sassOptions: {
    loadPaths: [path.join(__dirname, 'src/styles/scss')],
    includePaths: [path.join(__dirname, 'src/styles/scss')],
    silenceDeprecations: ['legacy-js-api'],
  },

  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
    taint: true,
    scrollRestoration: true,
    serverSourceMaps: process.env.NODE_ENV === 'production' ? false : true,
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, path: false, os: false, net: false, tls: false };
    }
    return config;
  },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
