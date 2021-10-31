const Profile = () => import('@/views/Profile.vue')
const Identity = () => import('@/components/rmrk/Profile/Identity.vue')

export default [
  {
    path: '/rmrk/u/:id',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/identity',
    name: 'identity',
    component: Identity,
  },
]
