<template>
  <LandingPage />
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'full-width-layout',
})

useSeoMeta({
  title: 'KodaDot - Your Generative Art Marketplace',
  ogTitle: 'KodaDot - Your Generative Art Marketplace',
  description: 'One Stop NFT Shop on Polkadot',
  ogDescription: 'One Stop NFT Shop on Polkadot',
  ogImage: '/k_card.png',
  twitterCard: 'summary_large_image',
  ogUrl: process.env.BASE_URL || 'http://localhost:9090',
})
</script>
