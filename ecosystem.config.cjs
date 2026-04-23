module.exports = {
  apps: [
    {
      name: "packit-backend",
      script: "./dist/app.js",
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
