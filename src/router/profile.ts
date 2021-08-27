const Profile = () => import('@/views/Profile.vue')

export default [
  {
    path: '/rmrk/u/:id',
    name: 'profile',
    component: Profile,
  }
];
