import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from '@/routeGuard';

import Accounts from '@/router/accounts';
import Transfer from '@/router/transfer';
import Explorer from '@/router/explorer';
// import Staking from '@/router/staking';
import Toolbox from '@/router/toolbox';

const Landing = () => import('@/components/landing/Landing.vue');
const Democracy = () => import('@/components/democracy/DemocracyWrapper.vue');
const Settings = () => import('@/views/Settings.vue');
// const Toolbox = () => import('@/components/toolbox/Toolbox.vue');
const Chainstate = () => import('@/views/ChainState.vue');
const Extrinsics = () => import('@/views/Extrinsics.vue');
const Treasury = () => import('@/components/treasury/TreasuryWrapper.vue')
const FourZeroFour = () => import('@/components/FourZeroFour.vue')
const RPC = () => import('@/components/rpc/RPC.vue');
const Staking = () => import('@/views/Staking.vue');
const Remark = () => import('@/views/Remark.vue');
const Gallery = () => import('@/components/rmrk/Gallery/Gallery.vue')
const GalleryItem = () => import('@/components/rmrk/Gallery/GalleryItem.vue')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    
    ...Accounts,
    ...Transfer, 
    ...Explorer,
    // ...Staking,
    ...Toolbox,
    {
      path: '/democracy',
      name: 'democracy',
      component: Democracy,
      beforeEnter: apiEnabled,
    },
    {
			path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/rpc',
      name: 'rpc',
      component: RPC,
      beforeEnter: apiEnabled,
    },
    {
      path: '/chainstate',
      name: 'chainstate',
      component: Chainstate
    },
    {
			path: '/extrinsics',
      name: 'extrinsics',
      component: Extrinsics,
      beforeEnter: apiEnabled,
    },
    {
			path: '/staking',
      name: 'staking',
      component: Staking
    },
    {
			path: '/treasury',
      name: 'treasury',
      component: Treasury
    },
    {
			path: '/rmrk',
      name: 'rmrk',
      component: Remark
    },
    {
      path: '/nft',
      name: 'nft',
      component: Gallery,
    },
    {
      path: '/nft/detail/:id',
      name: 'nftDetail',
      component: GalleryItem,
    },
		{
			path: '*',
			name: 'FourZeroFour',
			component: FourZeroFour,
		},
  ],
});
