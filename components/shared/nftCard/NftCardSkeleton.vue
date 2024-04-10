<template>
  <div class="nft-card">
    <div class="media-object nft-media">
      <div class="is-square image">
        <NeoSkeleton :rounded="false" full-size no-margin />
      </div>
    </div>
    <div
      v-if="!hideMediaInfo"
      class="nft-media-info"
      :class="`nft-media-info__${variant}`">
      <NeoSkeleton size="medium" no-margin />
      <div class="flex mt-2">
        <NeoSkeleton size="small" no-margin width="100px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'

defineProps<{
  hideMediaInfo?: boolean
  variant?: string
}>()
</script>
