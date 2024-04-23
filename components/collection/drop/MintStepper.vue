<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    data-testid="drop-stepper-container"
    :max="max"
    :disabled="!isLogIn"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full md:w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { isLogIn } = useAuth()
const { availableNfts } = useHolderOfCollection()
const { amountToMint, drop, mintsCount } = storeToRefs(useDropStore())

const show = computed(() => drop.value.type !== 'free')

const max = computed(() => {
  const options = [
    drop.value.max && drop.value.max - mintsCount.value,
    DROP_MASSMINT_LIMIT[drop.value.alias] ?? undefined, // tmp remove when uploading to IPFS step can be skipped @see https://github.com/kodadot/nft-gallery/issues/10001#issuecomment-2041533819
  ]

  if (drop.value.type === 'holder') {
    options.push(availableNfts.serialNumbers.length)
  }

  return Math.min(...options.filter((option) => option !== undefined))
})
</script>
