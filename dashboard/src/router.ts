import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from './routeGuard';

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('./components/landing/Landing.vue'),
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('./views/Accounts.vue'),
      // beforeEnter: apiEnabled,
    },
    {
      path: '/accounts/create',
      name: 'accountsCreate',
      component: () => import('./views/AccountsCreate.vue'),
      // beforeEnter: apiEnabled,
    },
    {
      path: '/accounts/backup/:address',
      name: 'accountsBackup',
      component: () => import('./views/AccountsBackup.vue'),
      // beforeEnter: apiEnabled,
    },
    {
      path: '/accounts/changepassword/:address',
      name: 'accountsChangePassword',
      component: () => import('./views/AccountsChangePassword.vue'),
      beforeEnter: apiEnabled,
    },
    {
      path: '/accounts/restore',
      name: 'accountsRestore',
      component: () => import('./views/AccountsRestore.vue'),
      // beforeEnter: apiEnabled,
    },
    {
      path: '/addressbook',
      name: 'addressbook',
      component: () => import('./components/addressbook/Addressbook.vue'),
      // beforeEnter: apiEnabled,
    },
    {
      path: '/addressbook/create',
      name: 'addressbookCreate',
      component: () => import('./views/AddressbookCreate.vue'),
      beforeEnter: apiEnabled,
    },
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
      path: '/staking',
      name: 'staking',
      component: () => import('./views/Staking.vue')
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
      // beforeEnter: apiEnabled,
    },
    {
      path: '/explorer/:tab/:hash',
      name: 'explorerByTabHash',
      component: () => import('./components/explorer/Explorer.vue'),
      // beforeEnter: apiEnabled,
    },
    {
			path: '/extrinsics',
      name: 'extrinsics',
      component: () => import('./views/Extrinsics.vue'),
      beforeEnter: apiEnabled,
    },
		{
			path: '*',
			name: 'FourZeroFour',
			component: () => import('./components/FourZeroFour.vue'),
		},
  ],
});
