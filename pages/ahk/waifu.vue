<template>
  <GenerativeMint />
</template>

<script lang="ts" setup>
import GenerativeMint from '@/components/bsx/Create/GenerativeMint.vue'

definePageMeta({
  layout: 'generative-mint-layout',
})

useSeoMeta({
  title: 'Mint Your Waifu',
  ogType: 'article',
  description: 'Create yourself a uique Waifu NFT',
  ogUrl: '/ahk/waifu',
})
</script>
