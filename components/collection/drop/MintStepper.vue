<template>
  <NeoStepper
    v-if="show"
    v-model="amountToMint"
    :max="max"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'

const { amountToMint, drop } = storeToRefs(useDropStore())

const show = computed(() => drop.value.type !== 'free')

const max = inject('amountAvailableNFTs') as number | undefined
</script>
