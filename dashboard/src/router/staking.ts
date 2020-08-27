import { apiEnabled } from '@/routeGuard';

const Overview = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Overview.vue');
const Targets = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Targets/Targets.vue');
const Waiting = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Waiting/Waiting.vue');
const Actions = () => import(/* webpackChunkName:'explorer' */ '@/components/staking/Actions/Actions.vue');

export default [
    {
        path: '/staking',
        name: 'staking',
        component: Overview,
        beforeEnter: apiEnabled,
        children: [
          {
            path: 'targets',
            name: 'targets',
            component: Targets,
          },
          {
            path: 'Waiting',
            name: 'Waiting',
            component: Waiting,
          },
          {
            path: 'Actions',
            name: 'Actions',
            component: Actions,
          },
        ]
    },
]
