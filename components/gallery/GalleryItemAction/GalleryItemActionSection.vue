<template>
  <div class="is-flex gallery-item-action-section">
    <div class="gallery-item-action-section__info">
      <p class="has-text-grey">{{ title }}</p>
      <div class="is-flex gallery-item-action-section__price-box">
        <div
          v-if="Number(price)"
          class="gallery-item-action-section__price has-text-weight-bold">
          {{ priceChain }}
        </div>
        <div v-else class="has-text-weight-bold is-size-3">--</div>

        <div
          v-if="Number(price)"
          class="has-text-grey is-flex is-align-items-center gallery-item-action-section__price-sub">
          {{ priceUsd }} USD
        </div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import format from '@/utils/format/balance'
import { getKSMUSD } from '@/utils/coingecko'

const { urlPrefix } = usePrefix()
const { decimals, unit } = useChain()
const { tokenId, assets } = usePrefix()

const props = defineProps<{
  title: string
  price: string
}>()

const priceChain = ref('0')
const priceUsd = ref('0')

watchEffect(async () => {
  const ksmPrice = localStorage.getItem('KSM') || (await getKSMUSD())
  const { symbol } = assets(tokenId.value)
  const price = format(props.price || '0', decimals.value, '')
  const chainSymbol = urlPrefix.value === 'rmrk' ? unit.value : symbol

  priceChain.value = `${price} ${chainSymbol}`
  priceUsd.value = `${Math.round(Number(price) * Number(ksmPrice))}`
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.gallery-item-action-section {
  justify-content: space-between;
  align-items: center;

  &__price {
    margin-right: 1rem;
    font-size: 2rem;
    &-box {
      align-content: center;
    }
  }
  @include until-widescreen {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    &__info {
      min-width: 10rem;
      text-align: left;
      > p {
        font-size: 0.8rem;
        margin-bottom: -0.3rem;
      }
    }
    &__price {
      margin-right: 0;
      font-size: 1.5rem;

      &-box {
        flex-direction: column;
        align-content: left;
        margin-bottom: 1rem;
      }
      &-sub {
        margin-top: -0.3rem;
        font-size: 0.8rem;
      }
    }
  }
}
</style>
