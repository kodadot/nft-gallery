import { apiEnabled } from '@/routeGuard';

const arvrmain = () => import(/* webpackChunkName:'accounts' */ '@/components/arvr/Explorer.vue');

export default [
  {
    path: '/arvr',
    name: 'arvr',
    component: arvrmain
  }
]
