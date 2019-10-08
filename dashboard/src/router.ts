import Vue from 'vue';
import Router from 'vue-router';
import FourZeroFour from './components/FourZeroFour.vue';
import Accounts from './components/accounts/Accounts.vue';
import Addressbook from './components/addressbook/Addressbook.vue';
import Transfer from './components/transfer/Transfer.vue';
import Democracy from './components/democracy/Democracy.vue';
import Explorer from './components/explorer/Explorer.vue';
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
      path: '/addressbook',
      name: 'addressbook',
      component: Addressbook,
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: Transfer,
    },
    {
      path: '/democracy',
      name: 'democracy',
      component: Democracy,
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: Explorer,
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
      component: () => import('./views/Explorer.vue'),
    },
    {
      path: '/extrinsics',
      name: 'extrinsics',
      component: () => import('./views/Extrinsics.vue'),
    },
  ],
});
