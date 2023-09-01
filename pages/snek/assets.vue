<template>
  <AssetList />
</template>

<script lang="ts" setup>
import AssetList from '@/components/bsx/Asset/AssetList.vue'

useSeoMeta({
  title: 'Select Payment Asset',
  description: 'Select asset for paying transaction fees',
  ogUrl: '/snek/assets',
})
</script>
