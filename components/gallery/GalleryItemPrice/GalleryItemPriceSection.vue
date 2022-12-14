<template>
  <div class="is-flex is-justify-content-space-between is-align-items-center">
    <div>
      <p class="has-text-grey">{{ title }}</p>
      <div class="is-flex is-align-items-center">
        <div v-if="Number(price)" class="has-text-weight-bold is-size-3 mr-5">
          {{ priceChain }}
        </div>
        <div v-else class="has-text-weight-bold is-size-3">--</div>

        <div v-if="Number(price)" class="has-text-grey">{{ priceUsd }} USD</div>
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

  priceChain.value = `${parseFloat(price).toFixed(2)} ${chainSymbol}`
  priceUsd.value = `$${Math.round(Number(price) * Number(ksmPrice))}`
})
</script>

<style scoped></style>
