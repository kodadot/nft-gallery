import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import { apiEnabled } from '@/routeGuard'

import Transfer from '@/router/transfer'
import Toolbox from '@/router/toolbox'
import Rmrk from '@/router/rmrk'
import Profile from '@/router/profile'

const Landing = () => import('@/components/landing/Landing.vue')
const Sustainability = () => import('@/components/landing/Sustainability.vue')
const EsSustainability = () => import('@/components/landing/EsSustainability.vue')
const Carbonless = () => import('@/components/landing/Carbonless.vue')
const EsCarbonless = () => import('@/components/landing/EsCarbonless.vue')
const Settings = () => import('@/views/Settings.vue')
const Extrinsics = () => import('@/views/Extrinsics.vue')
const Spotlight = () => import('@/components/landing/Spotlight.vue')
const About = () => import('@/components/landing/About.vue')
const Contact = () => import('@/components/landing/Contact.vue')
const Partnership = () => import('@/components/landing/Partnership.vue')
const Tutorials = () => import('@/components/landing/Tutorials.vue')
const FourZeroFour = () => import('@/components/FourZeroFour.vue')
const Error = () => import('@/components/Error.vue')
const Series = () => import('@/components/landing/Series.vue')
// const Toolbox = () => import('@/components/toolbox/Toolbox.vue');

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/sustainability',
      name: 'sustainability',
      component: Sustainability,
    },
    {
      path: '/es/sustainability',
      name: 'esSustainability',
      component: EsSustainability,
    },
    {
      path: '/carbonless',
      name: 'carbonless',
      component: Carbonless,
    },
    {
      path: '/es/MovimientoNFTSinEmisionesDeCarbono',
      name: 'esCarbonless',
      component: EsCarbonless,
    },
    ...Transfer,
    ...Toolbox,
    ...Rmrk,
    ...Profile,
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/extrinsics',
      name: 'extrinsics',
      component: Extrinsics,
      beforeEnter: apiEnabled,
    },
    {
      path: '/spotlight',
      name: 'spotlight',
      component: Spotlight,
    },
    {
      path: '/series-insights',
      name: 'series',
      component: Series,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/partnership',
      name: 'partnership',
      component: Partnership,
    },
    {
      path: '/tutorials',
      name: 'tutorials',
      component: Tutorials,
    },
    {
      path: '/grants',
      name: 'grants',
      component: {},
      beforeEnter(to, from, next) {
        window.location.href = 'https://tally.so/r/mVP06w'
      }
    },
    {
      path: '/permafrost',
      name: 'permafrost',
      component: {},
      beforeEnter(to, from, next) {
        window.location.href = 'https://discord.gg/88da2MEfU9'
      }
    },
    {
      path: '/error',
      name: 'error',
      component: Error,
    },
    {
      path: '*',
      name: 'FourZeroFour',
      component: FourZeroFour,
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})
