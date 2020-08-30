import { apiEnabled } from '@/routeGuard';

const Staking = () => import(/* webpackChunkName:'explorer' */ '@/views/Staking.vue');
const Overview = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Overview.vue');
const Targets = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Targets/Targets.vue');
const Waiting = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Waiting/Waiting.vue');
const Actions = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Actions/Actions.vue');

const StakingDefault = () => import(/* webpackChunkName:'explorer' */ '@/views/Staking.vue');

export default [
  {
    path: '/staking/0',
    name: 'staking',
    component: Staking,
  // beforeEnter: apiEnabled,
  
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
      {
        path: 'targets',
        name: 'targets',
        component: Targets,
      },
      {
        path: 'waiting',
        name: 'waiting',
        component: Waiting,
      },
      {
        path: 'actions',
        name: 'actions',
        component: Actions,
      },
    ]
  }
]
