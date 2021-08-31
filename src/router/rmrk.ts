const Remark = () => import('@/views/Remark.vue');
const Gallery = () => import('@/components/rmrk/Gallery/Gallery.vue')
const GalleryItem = () => import('@/components/rmrk/Gallery/GalleryItem.vue')
const rmrkCredit = () => import('@/components/rmrk/Credit/Credit.vue')
const rmrkFaq = () => import('@/components/rmrk/Faq.vue')
const Packs = () => import('@/components/rmrk/Pack/Packs.vue')
const PackItem = () => import('@/components/rmrk/Pack/PackItem.vue')
const CollectionItem = () => import('@/components/rmrk/Gallery/CollectionItem.vue')
const ViewModel = () => import('@/components/rmrk/Gallery/ViewModel.vue')
const SimpleMint = () => import('@/components/rmrk/Create/SimpleMint.vue')

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
  {
    path: '/rmrk/packs',
    name: 'packs',
    component: Packs,
  },
  {
    path: '/rmrk/pack/:id',
    name: 'packDetail',
    component: PackItem,
  },
  {
    path: '/rmrk/collection/:id',
    name: 'collectionDetail',
    component: CollectionItem,
  },
  {
    path: '/rmrk/view',
    name: 'viewModel',
    component: ViewModel,
  },
  {
    path: '/rmrk/mint',
    name: 'simpleMint',
    component: SimpleMint
  },
];
