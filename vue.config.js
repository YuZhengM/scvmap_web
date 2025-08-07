module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/scvmap' : '/',
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 100 * 1024 * 1024,
      maxEntrypointSize: 100 * 1024 * 1024
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 512 * 1024,
        maxSize: 1024 * 1024,
        minChunks: 1,
        maxAsyncRequests: 10,
        maxInitialRequests: 5,
        automaticNameDelimiter: '_',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      usedExports: true,
      runtimeChunk: 'single'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
    open: true,
    proxy: {
      '/api': {
        // 接口域名
        target: process.env.NODE_ENV === 'production' ? 'https://${IP}/scvmap_service/' : 'http://localhost:${service_port}/scvmap_service/',
        // 是否跨域
        changeOrigin: true,
        // 是否代理 websockets
        ws: true,
        // 是否 https 接口
        secure: process.env.NODE_ENV === 'production',
        // 路径重置
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
