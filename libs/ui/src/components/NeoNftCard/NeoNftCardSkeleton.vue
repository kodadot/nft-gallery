<template>
  <div class="nft-card">
    <div class="media-object nft-media">
      <div class="is-square image">
        <div class="is-absolute top-0 w-full h-full">
          <b-skeleton :rounded="false" height="100%" width="100%" />
        </div>
      </div>
    </div>
    <div :class="`nft-media-info__${variant}`">
      <b-skeleton width="100%" />
      <b-skeleton size="is-small" width="100px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NftCardVariant } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    variant?: NftCardVariant
  }>(),
  {
    variant: 'primary',
  }
)
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';

.is-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.image .b-skeleton {
  height: 100%;
}
</style>
