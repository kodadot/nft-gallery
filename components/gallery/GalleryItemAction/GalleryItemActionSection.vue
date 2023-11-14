<template>
  <div class="is-flex gallery-action-section">
    <div class="gallery-action-section-info">
      <div class="has-text-grey gallery-action-section-info-title">
        {{ title }}
      </div>
      <div
        class="is-flex gallery-action-section-price-box"
        data-testid="item-price">
        <div
          v-if="Number(price)"
          data-testid="money"
          class="gallery-action-section-price has-text-weight-bold">
          {{ priceChain }}
        </div>
        <div v-else class="has-text-weight-bold is-size-3">--</div>

        <div
          v-if="Number(price)"
          class="has-text-grey is-flex is-align-items-center gallery-action-section-price-sub">
          {{ priceUsd }} USD
        </div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { type Token, getPrice } from '@/utils/price'
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
    const token = chainSymbol.value as Token
    const tokenPrice = await getPrice(token, 'number')

    const tokenAmount = calculateBalanceUsdValue(
      Number(props.price) || 0,
      decimals.value,
    )
    const price = roundTo(tokenAmount, 4)
    priceChain.value = `${price} ${chainSymbol.value}`
    priceUsd.value = `${roundTo(tokenAmount * tokenPrice[token].usd, 4)}`
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

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

  @include until-widescreen {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .gallery-action-section-info {
      min-width: 10rem;
      text-align: left;

      .gallery-action-section-info-title {
        font-size: 0.8rem;
      }

      .gallery-action-section-price-box {
        flex-direction: column;
        align-content: flex-start;
        margin-bottom: 1rem;

        .gallery-action-section-price {
          margin-right: 0;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        .gallery-action-section-price-sub {
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
