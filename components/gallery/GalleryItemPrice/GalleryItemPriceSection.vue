<template>
  <div class="is-flex is-justify-content-space-between is-align-items-center">
    <div>
      <p class="has-text-grey">{{ title }}</p>
      <div class="is-flex is-align-items-center">
        <div class="has-text-weight-bold is-size-3 mr-5">{{ priceChain }}</div>
        <div class="has-text-grey">{{ priceUsd }} USD</div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import format from '@/utils/format/balance'
import { getKSMUSD } from '@/utils/coingecko'

const { decimals } = useChain()
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

  priceChain.value = `${parseFloat(price).toFixed(2)} ${symbol}`
  priceUsd.value = `$${Math.round(Number(price) * Number(ksmPrice))}`
})
</script>

<style scoped></style>
