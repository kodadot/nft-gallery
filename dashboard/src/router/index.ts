import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from '@/routeGuard';

import Accounts from '@/router/accounts';
import Transfer from '@/router/transfer';
import Toolbox from '@/router/toolbox';
import Rmrk from '@/router/rmrk';
import Profile from '@/router/profile';

const Landing = () => import('@/components/landing/Landing.vue');
const Sustainability = () => import('@/components/landing/Sustainability.vue');
const EsSustainability = () => import('@/components/landing/EsSustainability.vue');
const Carbonless = () => import('@/components/landing/Carbonless.vue');
const EsCarbonless = () => import('@/components/landing/EsCarbonless.vue');
const Settings = () => import('@/views/Settings.vue');
const Extrinsics = () => import('@/views/Extrinsics.vue');
const Leaderboard = () => import('@/components/landing/Leaderboard.vue');
const About = () => import('@/components/landing/About.vue');
const Contact = () => import('@/components/landing/Contact.vue');
const Partnership = () => import('@/components/landing/Partnership.vue');
const Tutorials = () => import('@/components/landing/Tutorials.vue');
const FourZeroFour = () => import('@/components/FourZeroFour.vue')
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
      path: 'es/MovimientoNFTSinEmisionesDeCarbono',
      name: 'esCarbonless',
      component: EsCarbonless,
    },
    ...Accounts,
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
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
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
			path: '*',
			name: 'FourZeroFour',
			component: FourZeroFour,
		},
  ],
});
