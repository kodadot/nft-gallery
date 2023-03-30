import { defineNuxtConfig } from '@nuxt/bridge'
import SentryWebpackPlugin from '@sentry/webpack-plugin'
import { manifestIcons } from './utils/config/pwa'

import { apolloClientConfig } from './utils/constants'

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
  },

  server: {
    port: 9090, // default: 3000
    host: '0.0.0.0',
  },

  bridge: {
    nitro: true,
  },

  nitro: {
    publicAssets: [],
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'KodaDot - NFT Market Explorer',
    titleTemplate: '%s | Low Carbon NFTs',
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
    ],
  },

  loadingIndicator: {
    name: 'folding-cube',
    color: '#fc007b',
    background: 'black',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['styles/index.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuex-persist', mode: 'client' },
    { src: '~/plugins/polkadot', mode: 'client' },
    { src: '~/plugins/endpoint', mode: 'client' },
    { src: '~/plugins/seoMetaGenerator', mode: 'client' },
    { src: '~/plugins/keyboardEvents', mode: 'client' },
    { src: '~/plugins/userBalance', mode: 'client' },
    { src: '~/plugins/icons', mode: 'client' },
    { src: '~/plugins/consola', mode: 'client' },
    { src: '~/plugins/assets', mode: 'client' },
    '~/plugins/filters',
    '~/plugins/globalVariables',
    '~/plugins/pwa',
    '~/plugins/vueAudioVisual',
    '~/plugins/vueClipboard',
    '~/plugins/vueSocialSharing',
    '~/plugins/vueTippy',
    '~/plugins/vueLazyLoad',
  ],

  router: {
    middleware: ['prefix', 'redirects'],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      {
        path: '~/components',
        extensions: ['vue'],
      },
      {
        path: '~/components/common',
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
        path: '~/components/shared',
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
    // https://go.nuxtjs.dev/buefy
    [
      'nuxt-buefy',
      {
        css: false,
        defaultIconPack: 'fas',
        defaultIconComponent: 'vue-fontawesome',
        defaultFieldLabelPosition: 'inside',
        materialDesignIcons: false,
      },
    ],
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
    '@nuxtjs/sentry',
    '@kevinmarrec/nuxt-pwa',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    ['@pinia/nuxt', { disableVuex: false }],
  ],

  sentry: {
    disabled: process.env.NODE_ENV === 'development',
    lazy: true,
    dsn: 'https://6fc80708bf024dc8b43c3058f8260dd6@o4503930691256320.ingest.sentry.io/4503930702331904', // Enter your project's DSN here
    customClientIntegrations:
      process.platform !== 'win32' ? '@/plugins/sentry' : undefined,
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
      sampleRate: 0.25,
      whitelistUrls: [/kodadot\.xyz/],
      beforeSend(event) {
        if (window.navigator.userAgent.indexOf('prerender') !== -1) {
          return null
        }

        if (window.navigator.userAgent.indexOf('Headless') !== -1) {
          return null
        }

        return event
      },
    },
  },

  pwa: {
    manifest: {
      name: 'KodaDot - Polkadot NFT explorer',
      short_name: 'KodaDot',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      start_url: '/',
      icons: manifestIcons,
    },
    workbox: {
      // enabled: true, // enable this to use workbox in localhost
      autoRegister: true,
      workboxVersion: '6.5.4',
    },
    icon: false,
  },

  i18n: {
    skipSettingLocaleOnNavigate: true,
    vueI18nLoader: true,
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      fallbackLocale: 'en',
      alwaysRedirect: true,
    },
    loadLanguagesAsync: true,
    langDir: 'locales',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'cn', iso: 'cn', file: 'cn.json' },
      { code: 'fr', iso: 'fr', file: 'fr.json' },
      { code: 'es', iso: 'es', file: 'es.json' },
      { code: 'bn', iso: 'bn', file: 'bn.json' },
      { code: 'cz', iso: 'cz', file: 'cz.json' },
      { code: 'de', iso: 'de', file: 'de.json' },
      { code: 'hi', iso: 'hi', file: 'hi.json' },
      { code: 'it', iso: 'it', file: 'it.json' },
      { code: 'jp', iso: 'jp', file: 'jp.json' },
      { code: 'ko', iso: 'ko', file: 'ko.json' },
      { code: 'nl', iso: 'nl', file: 'nl.json' },
      { code: 'pl', iso: 'pl', file: 'pl.json' },
      { code: 'pt', iso: 'pt', file: 'pt.json' },
      { code: 'ru', iso: 'ru', file: 'ru.json' },
      { code: 'sk', iso: 'sk', file: 'sk.json' },
      { code: 'tu', iso: 'tu', file: 'tu.json' },
      { code: 'ua', iso: 'ua', file: 'ua.json' },
      { code: 'ur', iso: 'ur', file: 'ur.json' },
      { code: 'vt', iso: 'vt', file: 'vt.json' },
    ],
    strategy: 'no_prefix',
    vueI18n: '~/utils/config/i18n',
  },

  apollo: {
    clientConfigs: apolloClientConfig,
    // https://github.com/nuxt-community/apollo-module#options
  },

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
      '@kodadot1/sub-api',
      '@polkadot/api',
      '@polkadot/rpc-core',
      '@polkadot/rpc-provider',
      '@polkadot/types',
      '@polkadot/extension-dapp',
      '@polkadot/util-crypto',
      '@polkadot/keyring',
      '@polkadot/ui-keyring',
      '@polkadot/ui-settings',
      '@polkadot/hw-ledger',
      '@polkadot/types-codec',
      '@polkadot/wasm-bridge',
      '@google/model-viewer', // TODO check to see if it works without transpilation in future nuxt releases
    ],
    extend(config) {
      if (
        process.env.NODE_ENV !== 'development' &&
        process.env.SENTRY_AUTH_TOKEN
      ) {
        config.devtool = 'source-map'

        config.plugins.push(
          new SentryWebpackPlugin({
            org: 'kodadot',
            project: 'nft-gallery',
            include: './dist',
            authToken: process.env.SENTRY_AUTH_TOKEN,
          })
        )
      }

      // add markdown loader
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      })

      config.module.rules.push({
        test: /node_modules\/@substrate\/smoldot-light\/dist\/mjs\/.+\.js$/,
        loader: require.resolve('babel-loader'),
        query: { compact: true },
      })

      config.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      })
      config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js'
      config.node = {
        fs: 'empty',
      }
    },
    postcss: null,
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
    },
  },
  // In case of using ssr
  // privateRuntimeConfig: {}
})
