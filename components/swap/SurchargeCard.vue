<template>
  <div class="nft-card bg-k-grey-light px-4! py-6! flex flex-col items-center justify-between gap-4">
    <div class="text-lg text-center font-bold capitalize">
      {{ $t('swap.surchargeTitle') }}
    </div>

    <div class="flex flex-col gap-1 items-center justify-center rounded-2xl bg-background-color w-full h-full">
      <div class="text-[31px]">
        {{ formatted }}
      </div>

      <div class="text-k-grey">
        ~ {{ usd }} $USD
      </div>
    </div>

    <div class="text-xs text-center capitalize">
      {{ $t(surcharge.direction === 'Send' ? 'swap.surchargeIncludedWithYourItems' : 'swap.surchargeIncludedWithTheirItems') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type SwapSurcharge } from '@/composables/transaction/types'

const props = defineProps<{
  surcharge: SwapSurcharge
}>()

const { decimals, chainSymbol } = useChain()

const { usd, formatted } = useAmount(
  computed(() => props.surcharge.amount),
  decimals,
  chainSymbol,
)
</script>
