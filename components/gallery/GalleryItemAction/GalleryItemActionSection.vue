<template>
  <div class="flex gallery-action-section">
    <div class="gallery-action-section-info">
      <div class="text-k-grey gallery-action-section-info-title">
        {{ title }}
      </div>
      <div
        class="flex gallery-action-section-price-box"
        data-testid="item-price"
      >
        <div
          v-if="Number(price)"
          data-testid="money"
          class="gallery-action-section-price font-bold"
        >
          {{ priceChain }}
        </div>
        <div
          v-else
          class="font-bold text-3xl"
        >
          --
        </div>

        <div
          v-if="Number(price)"
          class="text-k-grey flex items-center gallery-action-section-price-sub"
        >
          {{ priceUsd }} USD
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { calculateBalanceUsdValue, roundTo } from '@/utils/format/balance'

const { decimals, chainSymbol } = useChain()

const props = defineProps<{
  title: string
  price: string
}>()

const priceChain = ref('0')
const priceUsd = ref('0')

watchEffect(async () => {
  if (props.price) {
    const tokenPrice = await getApproximatePriceOf(chainSymbol.value)

    const tokenAmount = calculateBalanceUsdValue(
      Number(props.price) || 0,
      decimals.value,
    )
    const price = roundTo(tokenAmount, 4)
    priceChain.value = `${price} ${chainSymbol.value}`
    priceUsd.value = `${roundTo(tokenAmount * tokenPrice, 1)}`
  }
})
</script>
