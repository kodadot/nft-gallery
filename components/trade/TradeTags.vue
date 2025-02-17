<template>
  <div class="flex items-center gap-4">
    <NeoTag
      v-if="trade.isAnyTokenInCollectionDesired"
      size="small"
      variant="k-purple"
    >
      <span>{{ $t('collection') }}</span>
    </NeoTag>
    <NeoTag
      v-if="trade.isExpired"
      size="small"
      variant="k-grey"
    >
      <span>{{ $t('expired') }}</span>
    </NeoTag>
    <NeoTag
      v-else
      size="small"
      variant="k-green"
    >
      <span>{{ $t('active') }}</span>
    </NeoTag>
  </div>
</template>

<script setup lang="ts">
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import { type TradeNftItem } from '@/components/trade/types'

defineProps<{
  trade: TradeNftItem
}>()
</script>
