<template>
  <AssetList />
</template>

<script lang="ts">
export default {
  name: 'AssetPage',
  components: {
    AssetList: () => import('@/components/bsx/Asset/AssetList.vue'),
  },
  head() {
    const title = 'Select Payment Asset'
    const metaData = {
      title,
      description: 'Select asset for paying transaction fees',
      url: '/snek/assets',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
