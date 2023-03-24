<template>
  <div>
    <Holder v-if="variant === 'Holders'" :nfts="holderNfts" />
    <Flipper v-else :flips="flips" />
  </div>
</template>

<script setup lang="ts">
import { FlipEvent, NFTExcludingEvents } from '../../utils/types'
import Flipper from './moreNFTs/Flipper.vue'
import Holder from './moreNFTs/Holder.vue'

withDefaults(
  defineProps<{
    variant: 'Holders' | 'Flippers'
    holderNfts?: NFTExcludingEvents[]
    flips?: FlipEvent[]
  }>(),
  {
    holderNfts: () => [],
    flips: () => [],
  }
)
</script>
