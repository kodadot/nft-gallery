<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    data-testid="drop-stepper-container"
    :max="max"
    :min="min"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full md:w-[200px]"
  />
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

const max = computed(() => isHolder.value ? availableNftsAmount.value : undefined)
</script>
