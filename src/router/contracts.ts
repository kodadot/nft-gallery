const rmrkCredit = () => import('@/components/rmrk/Credit/Credit.vue')
const rmrkFaq = () => import('@/components/rmrk/Faq.vue')
const ContractMint = () => import('@/components/rmrk/Create/ContractMint.vue')
const ContractGalleryItem = () => import('@/components/rmrk/Gallery/ContractGalleryItem.vue')
const ContractCollection = () => import('@/components/rmrk/Gallery/ContractCollection.vue')

const User = {
  template: '<router-view></router-view>'
}

export default [
  {
    path: '/detail/:id',
    component: User,
    children: [
      { path: '', name: 'contractDetail', component: ContractCollection },
      { path: ':item', name: 'superDetail', component: ContractGalleryItem },
    ]
  },

  {
    path: '/new',
    name: 'contractMint',
    component: ContractMint
  },
];
