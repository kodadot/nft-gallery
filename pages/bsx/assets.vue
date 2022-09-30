<template>
  <AssetList />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    AssetList: () => import('@/components/bsx/Asset/AssetList.vue'),
  },
})
export default class AssetPage extends Vue {}
</script>
