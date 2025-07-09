module.exports = {
  apps: [
    {
      name: "server",
      script: "./dist/server.js",
      cwd: __dirname,
      exec_mode: "cluster",
      instances: 2,
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
}
