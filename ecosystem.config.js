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
      // Run from project root so Next can resolve paths and load `.env*` consistently.
      cwd: '/home/opc/nextjs-keylog',
      script: '.next/standalone/server.js',
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
