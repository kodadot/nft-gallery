const Remark = () => import('@/views/Remark.vue');
const Gallery = () => import('@/components/rmrk/Gallery/Gallery.vue')
const GalleryItem = () => import('@/components/rmrk/Gallery/GalleryItem.vue')
const rmrkCredit = () => import('@/components/rmrk/Credit/Credit.vue')
const rmrkFaq = () => import('@/components/rmrk/Faq.vue')
const Packs = () => import('@/components/rmrk/Pack/Packs.vue')
const PackItem = () => import('@/components/rmrk/Pack/PackItem.vue')
const CollectionItem = () => import('@/components/rmrk/Gallery/OrmlCollection.vue')
const ViewModel = () => import('@/components/rmrk/Gallery/ViewModel.vue')
const SimpleMint = () => import('@/components/rmrk/Create/SimpleMint.vue')

const User = {
  template: '<router-view></router-view>'
}

export default [
  {
    path: '/detail/:id',
    component: User,
    children: [
      { path: '', name: 'contractDetail', component: CollectionItem },
      { path: ':item', name: 'superDetail', component: GalleryItem },
    ]
  },

  {
    path: '/new',
    name: 'ormlNew',
    component: Remark
  },
];
