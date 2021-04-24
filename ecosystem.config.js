const IS_PRODUCTION = process.env.NODE_ENV === "production";
module.exports = {
  apps: [
    {
      name: IS_PRODUCTION ? "quant-task" : "quant-task-test", // 名称
      script: "dist/index.js",
      instances: 1, // 实例
      env: {
        NODE_ENV: "development", //启动默认模式
      },
      env_production: {
        NODE_ENV: "production", //使用production模式 pm2 start ecosystem.config.js --env production
      },
    },
  ],
};
