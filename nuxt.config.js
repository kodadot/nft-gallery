import defineApolloConfig, { toApolloEndpoint } from '@/utils/config/defineApolloConfig'

export default {
  server: {
    port: 9090, // default: 3000
    host: '0.0.0.0'
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'KodaDot - Polkadot / Kusama NFT Explorer',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@600;700&display=swap' },
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
    '~/plugins/filters',
    '~/plugins/globalVariables',
    '~/plugins/metaInfo',
    '~/plugins/pwa',
    '~/plugins/vueAudioVisual',
    '~/plugins/vueClipboard',
    '~/plugins/vueSocialSharing',
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/vueTippy',
    '~/plugins/vueGtag',
  ],

  router: {
    middleware: ['prefix']
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
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
        path: '~/components/shared',
        extensions: ['vue'],
      },
      {
        path: '~/components/spotlight',
        extensions: ['vue'],
      },
      {
        path: '~/components/toolbox',
        extensions: ['vue'],
      },
      {
        path: '~/components/transfer',
        extensions: ['vue'],
      },
    ],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/google-analytics',
    '@nuxtjs/pwa',
  ],

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
      },
    ],
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
  ],

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
    disabled: true,
  },

  pwa: {
    manifest: {
      name: 'KodaDot - Polkadot / Kusama NFT explorer',
      short_name: 'KodaDot'
    },
    // according to Google using purpose ['any', 'maskable'] is discouraged
    icon: {
      purpose: ['any']
    }
  },

  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      fallbackLocale: 'en',
      alwaysRedirect: true,
    },
    loadLanguagesAsync: true,
    langDir: 'langDir',
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
    vueI18n: {
      fallbackLocale: 'en',
      // hide the warning message from the console.
      silentTranslationWarn: true,
      // silentFallbackWarn: true,
    },
  },

  apollo: {
    clientConfigs: { ...defineApolloConfig(), subsquid: toApolloEndpoint(process.env.SUBSQUID_ENDPOINT) }// https://github.com/nuxt-community/apollo-module#options
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend: function (config, { isDev, isClient }) {
      config.resolve.alias.vue = 'vue/dist/vue.common' //https://github.com/nuxt/nuxt.js/issues/1142#issuecomment-317272538
      config.node = {
        fs: 'empty',
      }
    },
  },

  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000,
    }
  },
  // env: {
  //   baseUrl : process.env.BASE_URL || 'http://localhost:9090',
  // },
  // https://nuxtjs.org/docs/configuration-glossary/configuration-env/
  publicRuntimeConfig: {
    prefix: process.env.URL_PREFIX || 'rmrk',
    baseUrl: process.env.BASE_URL || 'http://localhost:9090',
  },
  // In case of using ssr
  // privateRuntimeConfig: {}
}
