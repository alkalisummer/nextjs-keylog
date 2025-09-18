module.exports = {
  apps: [
    {
      name: 'keylog-api',
      cwd: '/home/opc/nestjs-keylog',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'keylog-web',
      cwd: '/home/opc/nextjs-keylog/.next/standalone',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
};
