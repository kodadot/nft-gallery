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

<style lang="scss" scoped>
.gallery-action-section {
  justify-content: space-between;
  align-items: center;

  .gallery-action-section-price-box {
    align-content: center;

    .gallery-action-section-price {
      margin-right: 1rem;
      font-size: 2rem;
    }
  }

  @apply bulma-until-widescreen:flex-col bulma-until-widescreen:justify-start bulma-until-widescreen:items-start;

  .gallery-action-section-info {
    @apply bulma-until-widescreen:min-w-[10rem] bulma-until-widescreen:text-left;

    .gallery-action-section-info-title {
      @apply bulma-until-widescreen:text-sm;
    }

    .gallery-action-section-price-box {
      @apply bulma-until-widescreen:flex-col bulma-until-widescreen:items-start bulma-until-widescreen:mb-4;

      .gallery-action-section-price {
        @apply bulma-until-widescreen:mr-0 bulma-until-widescreen:text-2xl;
      }

      .gallery-action-section-price-sub {
        @apply bulma-until-widescreen:text-sm;
      }
    }
  }
}
</style>
