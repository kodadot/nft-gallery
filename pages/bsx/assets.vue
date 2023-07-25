<template>
  <AssetList />
</template>

<script lang="ts">
export default {
  name: 'AssetPage',
  components: {
    AssetList: () => import('@/components/bsx/Asset/AssetList.vue'),
  },
}
</script>
