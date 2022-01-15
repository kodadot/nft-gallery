const Remark = () => import('@/views/Remark.vue')
const Collections = () => import('@/components/rmrk/Gallery/Collections.vue')
const Gallery = () => import('@/components/rmrk/Gallery/Gallery.vue')
const GalleryItem = () => import('@/components/rmrk/Gallery/GalleryItem.vue')
const rmrkCredit = () => import('@/components/rmrk/Credit/Credit.vue')
const rmrkFaq = () => import('@/components/rmrk/Faq.vue')
const Packs = () => import('@/components/rmrk/Pack/Packs.vue')
const PackItem = () => import('@/components/rmrk/Pack/PackItem.vue')
const CollectionItem = () => import('@/components/rmrk/Gallery/CollectionItem.vue')
const ViewModel = () => import('@/components/rmrk/Gallery/ViewModel.vue')
const SimpleMint = () => import('@/components/rmrk/Create/SimpleMint.vue')
const PermaMint = () => import('@/components/rmrk/Create/PermaMint.vue')
const AdminPanel = () => import('@/components/rmrk/Create/Admin/AdminPanel.vue')
const MassMint = () => import('@/components/rmrk/Create/MassMint.vue')

export default [
  {
    path: '/rmrk/create',
    name: 'rmrk',
    component: Remark
  },
  {
    path: '/rmrk/collections',
    name: 'collections',
    component: Collections,
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
  {
    path: '/permafrost/create',
    name: 'permafrost',
    component: PermaMint
  },
  {
    path: '/rmrk/admin',
    name: 'admin',
    component: AdminPanel
  },
  {
    path: '/rmrk/mass',
    name: 'massMint',
    component: MassMint
  }
]
