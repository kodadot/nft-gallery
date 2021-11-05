const Profile = () => import('@/views/Profile.vue')
const Identity = () => import('@/components/rmrk/Profile/IdentityForm.vue')

export default [
  {
    path: '/rmrk/u/:id',
    name: 'profile',
    component: Profile
  },
  {
    path: 'https://kusama.subscan.io/account/:id',
    name: 'subscan'
  },
  {
    path: '/identity',
    name: 'identity',
    component: Identity
  }
]
