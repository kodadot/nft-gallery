<template>
  <ExploreLayoutWithSidebar>
    <CollectionTrades :trade-type="TradeType.OFFER" />
  </ExploreLayoutWithSidebar>
</template>

<script setup lang="ts">
import { TradeType } from '@/composables/useTrades'

definePageMeta({
  layout: 'explore-layout',
})
</script>
