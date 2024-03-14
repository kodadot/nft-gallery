<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    :max="max"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full md:w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { availableNfts } = useHolderOfCollection()
const { amountToMint, drop } = storeToRefs(useDropStore())

const show = computed(() => drop.value.type !== 'free')
const max = computed(() => availableNfts.serialNumbers.length)
</script>
