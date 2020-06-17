// vue.config.js
module.exports = {
  publicPath: './',
  // https://webpack.js.org/configuration/dev-server/
  // https://cli.vuejs.org/config/#devserver
  devServer: {
    host: '127.0.0.1',
    port: 9090,
    hot: true,
    disableHostCheck: true,
  }, 
}
