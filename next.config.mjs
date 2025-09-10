/** @type {import('next').NextConfig} */

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  output: 'standalone',
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    NEXT_PUBLIC_IMAGE_PROXY_URL: process.env.NEXT_PUBLIC_IMAGE_PROXY_URL,
    NEXT_PUBLIC_KEYLOG_URL: process.env.NEXT_PUBLIC_KEYLOG_URL,
    OCI_CONFIG_PATH: process.env.OCI_CONFIG_PATH,

    //KEYLOG API URL
    KEYLOG_API_URL: process.env.KEYLOG_API_URL,
    NEXT_PUBLIC_KEYLOG_API_URL: process.env.NEXT_PUBLIC_KEYLOG_API_URL,

    //Oracle Cloud Instance DB(MySQL)
    CLOUD_MYSQL_HOST: process.env.CLOUD_MYSQL_HOST,
    CLOUD_MYSQL_PORT: process.env.CLOUD_MYSQL_PORT,
    CLOUD_MYSQL_USER: process.env.CLOUD_MYSQL_USER,
    CLOUD_MYSQL_PASSWORD: process.env.CLOUD_MYSQL_PASSWORD,
    CLOUD_MYSQL_DATABASE_NM: process.env.CLOUD_MYSQL_DATABASE_NM,

    //Oracle Cloud Bucket(Objejct Storage)
    CLOUD_BUCKET_NAME_SPACE: process.env.CLOUD_BUCKET_NAME_SPACE,
    CLOUD_BUCKET_NAME: process.env.CLOUD_BUCKET_NAME,
    CLOUD_BUCKET_URL: process.env.CLOUD_BUCKET_URL,

    OPENAI_ORGANIZAION_ID: process.env.OPENAI_ORGANIZAION_ID,

    //Chat GPT API KEY
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    //Naver API KEY
    X_NAVER_CLIENT_ID: process.env.X_NAVER_CLIENT_ID,
    X_NAVER_CLIENT_SECRET: process.env.X_NAVER_CLIENT_SECRET,

    //NEXT_AUTH
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,

    //Gmail Account
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
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
    reactCompiler: true,
    taint: true,
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
