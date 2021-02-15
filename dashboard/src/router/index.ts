import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from '@/routeGuard';

import Accounts from '@/router/accounts';
import Transfer from '@/router/transfer';
import Toolbox from '@/router/toolbox';
import Rmrk from '@/router/rmrk';

const Landing = () => import('@/components/landing/Landing.vue');
const Settings = () => import('@/views/Settings.vue');
const Extrinsics = () => import('@/views/Extrinsics.vue');
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
    ...Accounts,
    ...Transfer, 
    ...Toolbox,
    ...Rmrk,
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
			path: '*',
			name: 'FourZeroFour',
			component: FourZeroFour,
		},
  ],
});
