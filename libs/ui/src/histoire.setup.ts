import './histoire.scss'

import { defineSetupVue3 } from '@histoire/plugin-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Neo } from './'

export const setupVue3 = defineSetupVue3(({ app }) => {
  const script = document.createElement('script')
  script.src = 'https://kit.fontawesome.com/54f29b7997.js'
  script.crossOrigin = 'anonymous'
  script.async = true

  document.body.appendChild(script)

  app.component('FontAwesomeIcon', FontAwesomeIcon).use(Neo, {
    customIconPacks: {
      fass: {
        iconPrefix: 'fa-fw fa-',
      },
      fasr: {
        iconPrefix: 'fa-fw fa-',
      },
      fab: {
        iconPrefix: 'fa-fw fa-',
      },
    },
  })
})
