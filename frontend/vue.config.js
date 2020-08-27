const fallbackServerUrl = 'http://localhost:3000'
const serverUrl = process.env.VUE_APP_SERVER_URL || fallbackServerUrl

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: serverUrl,
        secure: false
      }
    },
    disableHostCheck: true,
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/waved/'
    : '/',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'CERX'
        args[0].meta = {viewport: 'width=device-width,initial-scale=1,user-scalable=no'}
        return args
      })
  }
}