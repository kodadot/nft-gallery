import Vue from 'vue'
import VueGtag from 'vue-gtag'

Vue.use(VueGtag, {
  config: { id: process.env.GOOGLE_ANALYTICS_ID },
  enable: false,
})
