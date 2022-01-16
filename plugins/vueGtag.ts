import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }): void => {
  Vue.use(VueGtag, {
    config: { id: app.$config.googleAnalyticsId },
    enable: true,
  })
}
