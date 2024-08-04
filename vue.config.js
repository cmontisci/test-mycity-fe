// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:80', // URL del server API
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' },
        logLevel: 'debug'
      },
    },
  },
};
