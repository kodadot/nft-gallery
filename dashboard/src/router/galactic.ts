import { apiEnabled } from '@/routeGuard';

const Galactic = () => import(/* webpackChunkName:'accounts' */ '@/components/galactic/Explorer.vue');

export default [
  {
    path: '/galactic',
    name: 'galactic',
    component: Galactic
  }
]
