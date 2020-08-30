import { apiEnabled } from '@/routeGuard';

const Staking = () => import(/* webpackChunkName:'explorer' */ '@/views/Staking.vue');
const Overview = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Overview.vue');
const Targets = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Targets/Targets.vue');
const Waiting = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Waiting/Waiting.vue');
const Actions = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Actions/Actions.vue');

export default [
  {
    path: '/staking/:tab',
    name: 'staking',
    component: Staking,
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
    name: 'staking',
    component: Staking,
    children: [
      {
        path: '',
        name: 'actions',
        compoentn: Actions
      },
    ]
  },
  {
    path: '/staking/2',
    name: 'staking',
    component: Staking,
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
    name: 'staking',
    component: Staking,
    children: [
      {
        path: '',
        name: 'waiting',
        component: Waiting
      }
    ]
  }
]
