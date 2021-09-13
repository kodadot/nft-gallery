const Transfer = () =>
  import(
    /* webpackChunkName:'transfer' */ '@/components/transfer/Transfer.vue'
  );

export default [
  {
    path: '/transfer',
    name: 'transfer',
    component: Transfer
  }
];
