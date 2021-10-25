export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'KodaDot - Polkadot / Kusama NFT Explorer',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // loading: '~/components/Loading.vue',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'styles/index.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/filters',
    '~/plugins/globalVariables',
    '~/plugins/metaInfo',
    '~/plugins/vueAudioVisual',
    '~/plugins/vueClipboard',
    '~/plugins/vueSocialSharing',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components'
    ]
  },


  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    ['nuxt-buefy', {
      css: false,
      defaultIconPack: 'fas',
      defaultIconComponent: 'vue-fontawesome',
      defaultFieldLabelPosition: 'inside'
    }],
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
  ],

  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      fallbackLocale: 'en',
      alwaysRedirect: true
    },
    loadLanguagesAsync: true,
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'cn', iso: 'cn', file: 'cn.json' },
    ],
    strategy: 'prefix', //strategy: 'prefix_except_default'
    vueI18n: {
      fallbackLocale: 'en',
      // hide the warning message from the console.
      silentTranslationWarn: true
      // silentFallbackWarn: true,
    }
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'https://api.subquery.network/sq/vikiival/magick'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: 'empty'
      }
    }
  },
}
