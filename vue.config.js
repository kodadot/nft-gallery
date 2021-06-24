// vue.config.js
module.exports = {
  // https://cli.vuejs.org/config/#publicpath
  publicPath: '/',
  runtimeCompiler: true,

  // https://webpack.js.org/configuration/dev-server/
  // https://cli.vuejs.org/config/#devserver
  devServer: {
    // host: '127.0.0.1',
    port: 9090,
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' }
      }
    }
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
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
      .rule('mjs$')
      .test(/\.mjs$/)
      .type('javascript/auto')
      .include.add(/node_modules/)
      .end()


  },

  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json']
    },
    module: {
      rules: [ // fixes https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    sitemap: {
      baseURL: 'https://nft.kodadot.xyz',
      outputDir: './public',
      defaults: {
        changefreq: 'daily',
        priority:   1.0,
      },
      pretty: true,
      urls: [
          '/',
          '/rmrk/rare',
          '/rmrk/gallery',
          '/rmrk/mint',
          '/rmrk/create',
          '/rmrk/credit',
          '/rmrk/faq',
          '/carbonless',
          '/sustainability'
      ]
    }
  }
};
