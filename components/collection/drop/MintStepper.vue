<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    data-testid="drop-stepper-container"
    :max="max"
    :min="min"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full md:w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { availableNfts } = useHolderOfCollection()
const { amountToMint, drop } = storeToRefs(useDropStore())

const show = computed(() => drop.value.type !== 'free')
const isHolder = computed(() => drop.value.type === 'holder')
const availableNftsAmount = computed(() => availableNfts.serialNumbers.length)

const min = computed(() =>
  isHolder.value ? Math.min(1, availableNftsAmount.value) : 1,
)

const max = computed(() => {
  // tmp remove when uploading to IPFS step can be skipped @see https://github.com/kodadot/nft-gallery/issues/10001#issuecomment-2041533819
  const dropMax = DROP_MASSMINT_LIMIT[drop.value.alias] ?? undefined

  if (isHolder.value) {
    return dropMax
      ? Math.min(dropMax, availableNftsAmount.value)
      : availableNftsAmount.value
  }

  return dropMax
})

function bindDropsEvents(event: KeyboardEvent) {
  switch (event.key) {
    case '-':
      amountToMint.value--
      break
    case '+':
      amountToMint.value++
      break
  }
}

useKeyboardEvents({ v: bindDropsEvents })
</script>
