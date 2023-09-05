import Vue from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'

// support vue3 https://www.npmjs.com/package/vue-dompurify-html
Vue.use(VueDOMPurifyHTML, {
  default: {
    ALLOWED_TAGS: ['a', 'strong'],
    ALLOWED_ATTR: ['href', 'target'],
  },
})
