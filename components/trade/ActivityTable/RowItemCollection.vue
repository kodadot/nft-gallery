<template>
  <div class="bg-neutral-3 dark:bg-neutral-11 flex flex-col rounded-xl h-full !px-3">
    <span class="text-k-grey capitalize"> {{ $t('trades.anyNftFrom') }} </span>
    <div class="flex items-center gap-2">
      <nuxt-link
        :to="`/${urlPrefix}/collection/${trade.considered.id}`"
        class="font-bold"
      >{{ trade.considered.name }}
      </nuxt-link>

      <TradeActivityTablePriceTag :value="price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TradeNftItem } from '@/components/trade/types'

defineProps<{
  trade: TradeNftItem
  price: string | undefined
}>()

const { urlPrefix } = usePrefix()
</script>
