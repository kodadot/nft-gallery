<template>
  <BaseCartItemDetails
    :name="trade.considered.name"
    :second-name="$t('collection')"
    :image="sanitizeIpfsUrl(trade.considered.image)"
  />
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { type TradeNftItem } from '@/components/trade/types'

defineProps<{
  trade: TradeNftItem
}>()
</script>
