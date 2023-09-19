import { Neo } from '@kodadot1/brick'

import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// nuxt will handle css
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon).use(Neo, {
    customIconPacks: {
      // https://fontawesome.com/docs/apis/javascript/methods#prefixes-and-style-classes
      // fa-sharp solid
      fass: {
        iconPrefix: 'fa-fw fa-',
      },
      // fa-sharp regular
      fasr: {
        iconPrefix: 'fa-fw fa-',
      },
      // fa brands
      fab: {
        iconPrefix: 'fa-fw fa-',
      },
    },
  })
})
