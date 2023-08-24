import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'it',
    messages: {
      en: {
        test: 'Hello, {name}!',
      },
      it: {
        test: 'Ciao, {name}!',
      },
    },
  })

  vueApp.use(i18n)
})
