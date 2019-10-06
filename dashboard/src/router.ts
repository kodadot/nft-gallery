import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Accounts.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
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
