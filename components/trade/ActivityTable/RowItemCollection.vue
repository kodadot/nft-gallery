<template>
  <div class="bg-neutral-3 dark:bg-neutral-11 flex flex-col rounded-xl h-full px-3!">
    <span class="text-k-grey capitalize"> {{ $t('trades.anyNftFrom') }} </span>
    <div class="flex items-center gap-2">
      <nuxt-link
        :to="`/${urlPrefix}/collection/${considered.id}`"
        class="font-bold"
      >{{ considered.name }}
      </nuxt-link>

      <TradeActivityTableSurchargeTag :value="surcharge" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TradeConsidered } from '@/components/trade/types'
import type { SwapSurcharge } from '@/composables/transaction/types'

defineProps<{
  considered: TradeConsidered
  surcharge: SwapSurcharge | undefined
}>()

const { urlPrefix } = usePrefix()
</script>
