export default {
  apps: [
    {
      name: 'astralis-server',
      script: 'server/dist/index.js',
      cwd: process.cwd(),
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 4000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_file: './logs/server-combined.log',
      time: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
