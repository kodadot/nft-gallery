<template>
  <div>
    <Holder
      v-if="variant === 'Holders'"
      :nfts="holderNfts"
    />
    <Flipper
      v-else
      :flips="flips"
    />
  </div>
</template>

<script setup lang="ts">
import Flipper from './NFTSDetailsDropdown/Flipper.vue'
import Holder from './NFTSDetailsDropdown/Holder.vue'
import type {
  FlipEvent,
  NFTExcludingEvents,
} from '@/composables/collectionActivity/types'

withDefaults(
  defineProps<{
    variant: 'Holders' | 'Flippers'
    holderNfts?: NFTExcludingEvents[]
    flips?: FlipEvent[]
  }>(),
  {
    holderNfts: () => [],
    flips: () => [],
  },
)
</script>
