<template>
  <ExploreLayoutWithSidebar>
    <CollectionTrades :trade-type="TradeType.OFFER" />
  </ExploreLayoutWithSidebar>
</template>

<script setup lang="ts">
import { TradeType } from '@/components/trade/types'

definePageMeta({
  layout: 'explore-layout',
})
</script>
