<template>
  <div class="nft-card">
    <div class="media-object nft-media">
      <div class="is-square image">
        <NeoSkeleton :rounded="false" full-size no-margin />
      </div>
    </div>
    <div class="nft-media-info">
      <NeoSkeleton size="medium" no-margin />
      <div class="is-flex mt-4">
        <NeoSkeleton size="small" no-margin width="100px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
