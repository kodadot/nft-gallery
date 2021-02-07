const Remark = () => import('@/views/Remark.vue');
const Gallery = () => import('@/components/rmrk/Gallery/Gallery.vue')
const GalleryItem = () => import('@/components/rmrk/Gallery/GalleryItem.vue')
const rmrkCredit = () => import('@/components/rmrk/Credit/Credit.vue')
const rmrkFaq = () => import('@/components/rmrk/Faq.vue')

export default [
  {
    path: '/rmrk/create',
    name: 'rmrk',
    component: Remark
  },
  {
    path: '/rmrk/gallery',
    name: 'nft',
    component: Gallery,
  },
  {
    path: '/rmrk/detail/:id',
    name: 'nftDetail',
    component: GalleryItem,
  },
  {
    path: '/rmrk/credit',
    name: 'rmrkCredit',
    component: rmrkCredit
  },
  {
    path: '/rmrk/faq',
    name: 'rmrkFaq',
    component: rmrkFaq,
  },
];
