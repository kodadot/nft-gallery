import Vue from 'vue';
import Router from 'vue-router';
import FourZeroFour from './components/FourZeroFour.vue';
import Accounts from './components/accounts/Accounts.vue';
import Addressbook from './components/addressbook/Addressbook.vue';
import Transfer from './components/transfer/Transfer.vue';
import Democracy from './components/democracy/Democracy.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Accounts,
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts,
    },
    {
      path: '/accounts/create',
      name: 'accountsCreate',
      component: () => import('./views/AccountsCreate.vue'),
    },
    {
      path: '/addressbook',
      name: 'addressbook',
      component: Addressbook,
    },
    {
      path: '/addressbook/create',
      name: 'addressbookCreate',
      component: () => import('./views/AddressbookCreate.vue'),
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: Transfer,
    },
    {
      path: '/transfer/from/:from',
      name: 'transfer',
      component: Transfer,
    },
    {
      path: '/transfer/to/:to',
      name: 'transfer',
      component: Transfer,
    },
    {
      path: '/democracy',
      name: 'democracy',
      component: Democracy,
    },
    {
      path: '*',
      name: 'FourZeroFour',
      component: FourZeroFour,
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
    },
    {
      path: '/extrinsics',
      name: 'extrinsics',
      component: () => import('./views/Extrinsics.vue'),
    },
  ],
});
