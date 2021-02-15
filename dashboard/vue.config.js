// vue.config.js
module.exports = {
  // https://cli.vuejs.org/config/#publicpath
  publicPath: '/',

  // https://webpack.js.org/configuration/dev-server/
  // https://cli.vuejs.org/config/#devserver
  devServer: {
    // host: '127.0.0.1',
    port: 9090,
    hot: true,
    disableHostCheck: true,
   
  },

  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true
    }
  },

  chainWebpack: config => {
    // ...other chains
    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include
      .add(/node_modules/)
      .end()
      .type('javascript/auto');
  },

  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json']
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
