import { apiEnabled } from '@/routeGuard';

const Staking = () => import(/* webpackChunkName:'explorer' */ '@/views/Staking.vue');
const Overview = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Overview.vue');
const Targets = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Targets/Targets.vue');
const Waiting = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Waiting/Waiting.vue');
const Actions = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Actions/Actions.vue');
const Payouts = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Payouts/Payouts.vue');

export default [
  {
    path: '/staking/0',
    component: Staking,
    beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'overview',
        component: Overview,
      },
    ]
  },
  {
    path: '/staking/1',
    component: Staking,
    beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'actions',
        component: Actions
      },
    ]
  },
  {
    path: '/staking/2',
    component: Staking,
    beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'targets',
        component: Targets
      }
    ]
  },
  {
    path: '/staking/3',
    component: Staking,
    beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'waiting',
        component: Waiting
      }
    ]
  },
  {
    path: '/staking/4',
    component: Staking,
    beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'waiting',
        component: Payouts
      }
    ]
  }
]
