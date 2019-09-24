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
      path: '*',
      name: 'FourZeroFour',
      component: FourZeroFour,
    },
    // {
    //   path: '/chat',
    //   name: 'chat',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/ChatRoom.vue'),
    // },
  ],
});
