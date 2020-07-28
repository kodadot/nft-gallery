import { apiEnabled } from '@/routeGuard';

const Transfer = () => import(/* webpackChunkName:'transfer' */ '@/components/transfer/Transfer.vue');

export default [
    {
        path: '/transfer',
        name: 'transfer',
        component: Transfer,
        // beforeEnter: apiEnabled,
      },
      {
        path: '/transfer/f/:from/t/:to/a/:amount/:asset',
        name: 'transferSignSubmit',
        component: Transfer,
        beforeEnter: apiEnabled,
      },
      {
        path: '/transfer/from/:from',
        name: 'transferFrom',
        component: Transfer,
        beforeEnter: apiEnabled,
      },
      {
        path: '/transfer/to/:to',
        name: 'transferTo',
        component: Transfer,
        beforeEnter: apiEnabled,
      },
      ]