
module.exports = {
  publicPath: "./",
  outputDir: "app",
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px2rem")({
            remUnit: 37.5,
          }),
        ],
      },
    },
  },
  devServer: {
    open: false,
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://zxjc.lbtc.cn:8888',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
};

