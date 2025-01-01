<template>
  <BaseCartItemDetails
    :name="trade.considered.name"
    :second-name="$t('collection')"
    :image="sanitizeIpfsUrl(trade.considered.image)"
  />
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'

defineProps<{
  trade: TradeNftItem
}>()
</script>
