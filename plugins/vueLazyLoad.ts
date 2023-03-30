import Vue from 'vue'

import VueLazyload from 'vue-lazyload'
import placeholder from '@/static/placeholder.webp'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: placeholder,
  attempt: 1,
})
