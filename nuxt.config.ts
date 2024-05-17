import { pwa } from './utils/config/pwa'
import { URLS, apolloClientConfig } from './utils/constants'
import * as fs from 'fs'
import svgLoader from 'vite-svg-loader'

const baseUrl = process.env.BASE_URL || 'http://localhost:9090'

export default defineNuxtConfig({
  server: {
    port: 9090, // default: 3000
    host: '0.0.0.0',
  },

  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  sourcemap: false,

  vue: {
    compilerOptions: {
      // model-viewer from ModelMedia throw warning
      isCustomElement: (tag) => tag.includes('model-viewer'),
    },
  },

  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [
      svgLoader({
        defaultImport: 'url',
      }),
    ],
    // https://github.com/nuxt/nuxt/issues/24196#issuecomment-1825484618
    optimizeDeps:
      process.env.NODE_ENV === 'development'
        ? {
            include: [
              '@google/model-viewer',
              '@kodadot1/minimark/common',
              '@kodadot1/minimark/shared',
              '@kodadot1/minimark/v1',
              '@kodadot1/minimark/v2',
              '@paraspell/sdk',
              '@polkadot/api',
              '@polkadot/api-augment',
              '@polkadot/types/generic/AccountId',
              '@polkadot/vue-identicon',
              '@ramp-network/ramp-instant-sdk',
              '@transak/transak-sdk',
              '@unhead/vue',
              'bn.js',
              'chart.js',
              'chart.js/auto',
              'chartjs-adapter-date-fns',
              'chartjs-plugin-zoom',
              'date-fns/format',
              'date-fns/formatDistanceToNow',
              'graphql-ws',
              'keen-slider/vue',
              'lodash/camelCase',
              'lodash/filter',
              'lodash/groupBy',
              'lodash/isEqual',
              'lodash/orderBy',
              'lodash/sortBy',
              'lodash/sum',
              'lodash/unionBy',
              'lodash/zipWith',
              'markdown-it',
              'partysocket',
              'prismjs',
              'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace',
              'qrcode.vue',
              'unzipit',
              'vue-chartjs',
              'wavesurfer.js',
            ],
          }
        : undefined,
  },

  nitro: {
    publicAssets: [],
  },

  // 🔧 Cloudflare build
  experimental: {
    appManifest: false,
  },

  // Disable server-side rendering
  ssr: false,

  // Global page headers: https://nuxt.com/docs/api/configuration/nuxt-config#head
  app: {
    head: {
      title: 'KodaDot - Your Generative Art Marketplace',
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
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/54f29b7997.js',
          crossorigin: 'anonymous',
          async: true,
        },
        {
          // https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
          innerHTML: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "kksold2jal");`,
          type: 'text/javascript',
        },
      ],
    },
  },

  // Global CSS: https://nuxt.com/docs/api/nuxt-config#components
  css: [
    '@/assets/styles/index.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  // Auto import components: https://nuxt.com/docs/api/nuxt-config#components
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

  // Modules: https://nuxt.com/docs/api/nuxt-config#components
  modules: [
    '@nuxt/image',
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/google-fonts',
    '@nuxtjs/device',
    '@dargmuesli/nuxt-cookie-control',
    'nuxt-gtag',
  ],

  image: {
    format: ['avif', 'webp'],
    providers: {
      customCloudflare: {
        provider: '~/providers/cloudflare.ts',
      },
    },
    provider: 'customCloudflare',
  },

  googleFonts: {
    families: {
      'Work+Sans': {
        wght: [400, 700],
        ital: [400, 700],
      },
      'Fira+Code': {
        wght: [600, 700],
      },
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
    download: false,
    inject: false,
  },

  pwa,

  i18n: {
    skipSettingLocaleOnNavigate: true,
    defaultLocale: 'en',
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

  cookieControl: {
    isAcceptNecessaryButtonEnabled: false,

    barPosition: 'bottom-full',

    localeTexts: {
      en: {
        manageCookies: 'Customize',
      },
    },

    cookies: {
      necessary: [
        {
          name: 'Cookie Control',
          description:
            'We use our own cookies and third-party cookies so that we can show you this website and better understand how you use it, with a view to improving the services we offer. If you continue browsing, we consider that you have accepted the cookies.',
          targetCookieIds: ['ncc_c', 'ncc_e'],
        },
      ],

      optional: [
        {
          id: 'ga',
          name: 'Google Analytics',
          description:
            'Analytics cookies help us understand how visitors interact with websites by collecting and reporting information anonymously.',
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`,
          targetCookieIds: ['_ga', '_gat', '_gid', 'ga-cookie-consent'],
        },
      ],
    },
  },

  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID,
    initialConsent: false,
  },

  site: {
    url: process.env.BASE_URL || 'http://localhost:9090',
    strictNuxtContentPaths: true,
  },

  sitemap: {
    sitemaps: true,
    urls: () => {
      const posts = fs.readdirSync('content/blog')
      return posts
        .map((post) => post.split('.')[0])
        .map((page) => ({
          loc: `/blog/${page}`,
          changefreq: 'weekly',
          priority: 0.8,
        }))
    },
  },

  routeRules: {
    '/ahp/collection/13': { sitemap: { changefreq: 'daily', priority: 0.3 } },
  },

  // https://nuxt.com/docs/api/nuxt-config#runtimeconfig
  runtimeConfig: {
    public: {
      prefix: process.env.URL_PREFIX || 'rmrk',
      baseUrl: process.env.BASE_URL || 'http://localhost:9090',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
      dev: process.env.NODE_ENV === 'development',
      rampApiKey: process.env.RAMP_API_KEY,
      transakApiKey: process.env.TRANSAK_API_KEY || '',
      transakEnvironment: process.env.TRANSAK_ENV || 'PRODUCTION',
    },
  },
  // In case of using ssr
  // privateRuntimeConfig: {}

  devtools: {
    enabled: true,
  },
})
