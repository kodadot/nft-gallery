import { apiEnabled } from '@/routeGuard';

const Explorer = () => import(/* webpackChunkName:'explorer' */ '@/components/explorer/Explorer.vue');

export default [
    {
        path: '/explorer',
        name: 'explorer',
        component: Explorer,
        beforeEnter: apiEnabled,
    },
    {
        path: '/explorer/:tab',
        name: 'explorerByTab',
        component: Explorer,
        beforeEnter: apiEnabled,
    },
    {
        path: '/explorer/:tab/:hash',
        name: 'explorerByTabHash',
        component: Explorer,
        beforeEnter: apiEnabled,
    },
]