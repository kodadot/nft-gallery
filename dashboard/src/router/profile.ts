const Profile = () => import('@/views/Profile.vue')

export default [
  {
    path: '/u/:id',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/u/:id/:tab',
    name: 'profile',
    component: Profile,
  }
];
