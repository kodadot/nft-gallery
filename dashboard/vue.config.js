// vue.config.js
module.exports = {
  publicPath: './',
  // https://webpack.js.org/configuration/dev-server/
  // https://cli.vuejs.org/config/#devserver
  devServer: {
    host: '0.0.0.0',
    port: 9090,
    hot: true,
    disableHostCheck: true,
  }, 
  chainWebpack: config => {
    config.externals({
      AFRAME: 'AFRAME',
    })
  },
}
