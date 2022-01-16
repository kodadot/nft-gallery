import Vue from 'vue'
import shortAddress from '@/utils/shortAddress'
import formatBalance from '@/utils/formatBalance'
import {
  toString,
  toNumber,
  toPercent,
  truncateStr,
  toSanitizedUrl,
} from '@/utils/filters'

Vue.filter('shortAddress', shortAddress)
Vue.filter('formatBalance', formatBalance)
Vue.filter('toString', toString)
Vue.filter('toNumber', toNumber)
Vue.filter('toPercent', toPercent)
Vue.filter('truncateStr', truncateStr)
Vue.filter('toSanitizedUrl', toSanitizedUrl)
