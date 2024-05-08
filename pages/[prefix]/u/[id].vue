<template>
  <div>
    <ProfileDetail />
    <ListingCartMini />
    <ListingCartModal />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

definePageMeta({
  layout: 'full-width-no-footer',
})

useSeoMeta({
  title: 'NFT Artist Profile on KodaDot',
  ogTitle: 'NFT Artist Profile on KodaDot',
  description: 'Find more NFTs from this creator',
  ogDescription: 'Find more NFTs from this creator',
  ogUrl: route.path,
})
</script>
