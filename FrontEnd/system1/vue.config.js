const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://43.139.160.67:8081', // 你的后端服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api' // 保持 /api 前缀
        }
      }
    }
  }
});
