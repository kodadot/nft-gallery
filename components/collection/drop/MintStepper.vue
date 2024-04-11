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

const max = computed(() =>
  drop.value.type === 'holder'
    ? availableNfts.serialNumbers.length
    : drop.value.max && drop.value.max - mintsCount.value,
)
</script>
