// import path from 'path'
// import * as fs from 'fs'
// import Mode from 'frontmatter-markdown-loader/mode'
import { pwa } from './utils/config/pwa'
import { URLS, apolloClientConfig } from './utils/constants'
// import { fromNodeMiddleware } from 'h3'

const baseUrl = process.env.BASE_URL || 'http://localhost:9090'

export default defineNuxtConfig({
  alias: {
    tslib: 'tslib/tslib.es6.js',
  },

  vue: {
    config: {
      productionTip: false,
      runtimeCompiler: true,
    },
    compilerOptions: {
      isCustomElement: (tag) => ['model-viewer'].includes(tag),
    },
  },

  server: {
    port: 9090, // default: 3000
    host: '0.0.0.0',
  },

  // bridge: {
  //   nitro: true,
  // },

  nitro: {
    publicAssets: [],
    preset: 'netlify',
    // preset: 'service-worker'
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://nuxt.com/docs/api/configuration/nuxt-config#head
  app: {
    head: {
      title: 'KodaDot - One Stop Shop for Polkadot NFTs',
      titleTemplate: '%s | One Stop Shop for Polkadot NFTs',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'name', content: 'KodaDot NFT Marketplace' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        // { property: 'og:site_name', content: 'KodaDot' },
        {
          hid: 'description',
          name: 'description',
          content: 'One Stop NFT Shop on Polkadot',
        },
        { property: 'og:locale', content: 'en_US' },
        { property: 'twitter:site', content: '@KodaDot' },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: baseUrl },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'KodaDot - NFT Market Explorer',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'One Stop NFT Shop on Polkadot',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${baseUrl}/k_card.png`,
        },
        {
          hid: 'twitter:url',
          property: 'twitter:url',
          content: baseUrl,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'KodaDot - NFT Market Explorer',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: 'One Stop NFT Shop on Polkadot',
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: `${baseUrl}/k_card.png`,
        },
        baseUrl === URLS.koda.baseUrl
          ? {}
          : {
              hid: 'robots',
              property: 'robots',
              content: 'noindex',
            },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@600;700&display=swap',
        },
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/54f29b7997.js',
          crossorigin: 'anonymous',
        },
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`,
          async: true,
        },
        {
          innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
        `,
          type: 'text/javascript',
        },
      ],
    },
  },

  loadingIndicator: {
    name: 'folding-cube',
    color: '#fc007b',
    background: 'black',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/styles/index.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/polkadot', mode: 'client' },
    // { src: '~/plugins/seoMetaGenerator', mode: 'client' },
    // { src: '~/plugins/keyboardEvents', mode: 'client' },
    // { src: '~/plugins/piniaPersistedState', mode: 'client' },
    // '~/plugins/filters',
    // '~/plugins/pwa',
    // '~/plugins/vueAudioVisual',
    // '~/plugins/vueTippy',
    // '~/plugins/safeHref',
  ],

  router: {
    middleware: ['prefix', 'redirects'],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      // ordering matters
      {
        path: '~/components/shared',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components/common',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components',
        extensions: ['vue'],
      },
      {
        path: '~/components/landing',
        extensions: ['vue'],
      },
      {
        path: '~/components/metadata',
        extensions: ['vue'],
      },
      {
        path: '~/components/rmrk',
        extensions: ['vue'],
      },
      {
        path: '~/components/series',
        extensions: ['vue'],
      },
      {
        path: '~/components/settings',
        extensions: ['vue'],
      },
      {
        path: '~/components/spotlight',
        extensions: ['vue'],
      },
      {
        path: '~/components/transfer',
        extensions: ['vue'],
      },
      {
        path: '~/components/unique',
        extensions: ['vue'],
      },
    ],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
    // '@nuxtjs/sentry',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/content',
    'nuxt-simple-sitemap',
  ],

  pwa,

  i18n: {
    skipSettingLocaleOnNavigate: true,
    vueI18nLoader: true,
    defaultLocale: 'en',
    loadLanguagesAsync: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      fallbackLocale: 'en',
      alwaysRedirect: true,
    },
    strategy: 'no_prefix',
    vueI18n: './utils/config/i18n.ts',
  },

  apollo: {
    clients: apolloClientConfig,
    clientConfigs: apolloClientConfig,
    // https://github.com/nuxt-community/apollo-module#options
  },

  // sitemap: {
  //   hostname: process.env.BASE_URL || 'http://localhost:9090',
  //   routes() {
  //     const posts = fs.readdirSync('content/blog')

  //     return posts
  //       .map((post) => post.split('.')[0])
  //       .map((post) => `/blog/${post}`)
  //   },
  // },

  hooks: {
    sitemap: {
      generate: {
        done(nuxtInstance) {
          fs.copyFileSync(
            `${nuxtInstance.options.generate.dir}/sitemap.xml`,
            'public/sitemap.xml'
          )
        },
      },
    },
  },

  // buildModules: ['nuxt-webpack-optimisations'],

  // webpackOptimisations: {
  //   features: {
  //     esbuildLoader: process.env.NODE_ENV !== 'development',
  //   },
  //   // https://github.com/privatenumber/esbuild-loader#%EF%B8%8F-options
  //   esbuildLoaderOptions: {
  //     client: {
  //       target: 'esnext',
  //       legalComments: 'none',
  //     },
  //     modern: {
  //       target: 'esnext',
  //     },
  //   },
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      // silence babel warning regarding exceeding file sizes (>500kb)
      compact: true,
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        name: true,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    transpile: [
      // '@kodadot1/sub-api',
      // '@polkadot/api',
      // '@polkadot/rpc-core',
      // '@polkadot/rpc-provider',
      // '@polkadot/types',
      // '@polkadot/extension-dapp',
      // 'polkadot/util',
      // '@polkadot/util-crypto',
      // '@polkadot/keyring',
      // '@polkadot/ui-keyring',
      // '@polkadot/ui-settings',
      // '@polkadot/hw-ledger',
      // '@polkadot/types-codec',
      // '@polkadot/wasm-bridge',
      // '@polkadot/wasm-util',
      // '@polkadot/wasm-crypto-wasm',
      '@google/model-viewer', // TODO check to see if it works without transpilation in future nuxt releases
    ],

    vite: {
      resolve: {
        alias: {
          './runtimeConfig': './runtimeConfig.browser',
        },
      },
    },
    // extend(config) {
    //   // for debugging
    //   // config.devtool = 'source-map'

    //   // add frontmatter-markdown-loader
    //   config.module.rules.push({
    //     test: /\.md$/,
    //     include: path.resolve(__dirname, 'content'),
    //     loader: 'frontmatter-markdown-loader',
    //     options: {
    //       mode: [Mode.VUE_COMPONENT, Mode.META],
    //       vue: {
    //         root: 'markdown-body',
    //       },
    //     },
    //   })

    //   config.module.rules.push({
    //     test: /\.mjs$/,
    //     loader: require.resolve('babel-loader'),
    //     query: { compact: true },
    //   })

    //   config.module.rules.push({
    //     test: /\.js$/,
    //     include: [path.resolve(__dirname, 'node_modules')],
    //     use: [
    //       { loader: require.resolve('@open-wc/webpack-import-meta-loader') },
    //       { loader: require.resolve('babel-loader'), query: { compact: true } },
    //     ],
    //   })

    //   config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js'
    //   config.node = {
    //     fs: 'empty',
    //   }
    // },

    postcss: {
      postcssOptions: {
        plugins: {},
      },
    },
  },

  // env: {
  //   baseUrl : process.env.BASE_URL || 'http://localhost:9090',
  // },
  // https://nuxtjs.org/docs/configuration-glossary/configuration-env/,
  runtimeConfig: {
    public: {
      prefix: process.env.URL_PREFIX || 'rmrk',
      baseUrl: process.env.BASE_URL || 'http://localhost:9090',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
      dev: process.env.NODE_ENV === 'development',
      transakApiKey: process.env.TRANSAK_API_KEY || '',
      transakEnvironment: process.env.TRANSAK_ENV || 'PRODUCTION',
    },
  },
  // In case of using ssr
  // privateRuntimeConfig: {}
})
