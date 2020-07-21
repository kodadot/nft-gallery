import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from './routeGuard';
import Accounts from '@/router/accounts';

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('./components/landing/Landing.vue'),
    },
    
    ...Accounts, 

    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('./components/transfer/Transfer.vue'),
      // beforeEnter: apiEnabled,
		},
		{
			path: '/transfer/f/:from/t/:to/a/:amount/:asset',
			name: 'transferSignSubmit',
      component: () => import('./components/transfer/Transfer.vue'),
      beforeEnter: apiEnabled,
		},
    {
      path: '/transfer/from/:from',
      name: 'transferFrom',
      component: () => import('./components/transfer/Transfer.vue'),
      beforeEnter: apiEnabled,
    },
    {
      path: '/transfer/to/:to',
      name: 'transferTo',
      component: () => import('./components/transfer/Transfer.vue'),
      beforeEnter: apiEnabled,
    },
    {
      path: '/democracy',
      name: 'democracy',
      component: () => import('./components/democracy/DemocracyWrapper.vue'),
      beforeEnter: apiEnabled,
    },
    {
			path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
    },
    {
      path: '/toolbox',
      name: 'toolbox',
      component: () => import('./components/toolbox/Toolbox.vue')
    },
    {
      path: '/rpc',
      name: 'rpc',
      component: () => import('./components/rpc/RPC.vue'),
      beforeEnter: apiEnabled,
    },
    {
      path: '/staking',
      name: 'staking',
      component: () => import('./views/Staking.vue')
    },
    {
      path: '/chainstate',
      name: 'chainstate',
      component: () => import('./views/ChainState.vue')
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: () => import('./components/explorer/Explorer.vue'),
      beforeEnter: apiEnabled,
    },
    {
			path: '/explorer/:tab',
      name: 'explorerByTab',
      component: () => import('./components/explorer/Explorer.vue'),
      beforeEnter: apiEnabled,
    },
    {
      path: '/explorer/:tab/:hash',
      name: 'explorerByTabHash',
      component: () => import('./components/explorer/Explorer.vue'),
      beforeEnter: apiEnabled,
    },
    {
			path: '/extrinsics',
      name: 'extrinsics',
      component: () => import('./views/Extrinsics.vue'),
      beforeEnter: apiEnabled,
    },
    {
			path: '/treasury',
      name: 'treasury',
      component: () => import('./components/treasury/TreasuryWrapper.vue')
    },
		{
			path: '*',
			name: 'FourZeroFour',
			component: () => import('./components/FourZeroFour.vue'),
		},
  ],
});
