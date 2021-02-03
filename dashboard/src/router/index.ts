import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import { apiEnabled } from '@/routeGuard';

import Accounts from '@/router/accounts';
import Transfer from '@/router/transfer';
import Toolbox from '@/router/toolbox';

const Landing = () => import('@/components/landing/Landing.vue');
const Settings = () => import('@/views/Settings.vue');
// const Toolbox = () => import('@/components/toolbox/Toolbox.vue');
const Extrinsics = () => import('@/views/Extrinsics.vue');
const FourZeroFour = () => import('@/components/FourZeroFour.vue')

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
    ...Toolbox,
    {
			path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
			path: '/extrinsics',
      name: 'extrinsics',
      component: Extrinsics,
      beforeEnter: apiEnabled,
    },
    {
			path: '/create-rmrk',
      name: 'rmrk',
      component: Remark
    },
    {
      path: '/rmrk-gallery',
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
