import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import Vue from 'vue'

const queryClient = new QueryClient()
Vue.use(VueQueryPlugin, { queryClient })
