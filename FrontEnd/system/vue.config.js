const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://43.139.160.67:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,token'
        },
        onProxyReq(proxyReq) {
          console.log('Proxy Request:', proxyReq.path);
        },
        onError(err) {
          console.error('Proxy Error:', err);
        }
      }
    }
  }
});
