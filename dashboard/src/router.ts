import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from './routeGuard';

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./components/accounts/Accounts.vue'),
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('./components/accounts/Accounts.vue'),
    },
    {
      path: '/accounts/create',
      name: 'accountsCreate',
      component: () => import('./views/AccountsCreate.vue'),
    },
    {
      path: '/accounts/backup/:address',
      name: 'accountsBackup',
      component: () => import('./views/AccountsBackup.vue'),
    },
    {
      path: '/accounts/changepassword/:address',
      name: 'accountsChangePassword',
      component: () => import('./views/AccountsChangePassword.vue'),
    },
    {
      path: '/accounts/restore',
      name: 'accountsRestore',
      component: () => import('./views/AccountsRestore.vue'),
    },
    {
      path: '/addressbook',
      name: 'addressbook',
      component: () => import('./components/addressbook/Addressbook.vue'),
    },
    {
      path: '/addressbook/create',
      name: 'addressbookCreate',
      component: () => import('./views/AddressbookCreate.vue'),
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('./components/transfer/Transfer.vue'),
      beforeEnter: apiEnabled,
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
