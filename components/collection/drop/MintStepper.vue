<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    data-testid="drop-stepper-container"
    :max="max"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full md:w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { availableNfts } = useHolderOfCollection()
const { amountToMint, drop } = storeToRefs(useDropStore())

const show = computed(() => drop.value.type !== 'free')

const max = computed(() => {
  const holderMax =
    drop.value.type === 'holder'
      ? availableNfts.serialNumbers.length
      : undefined
  // tmp remove when uploading to IPFS step can be skipped @see https://github.com/kodadot/nft-gallery/issues/10001#issuecomment-2041533819
  const dropMax = DROP_MASSMINT_LIMIT[drop.value.alias] ?? undefined

  if (holderMax) {
    return dropMax ? Math.min(dropMax, holderMax) : holderMax
  }

  return dropMax
})
</script>
