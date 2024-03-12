<template>
  <NeoStepper
    v-model="amountToMint"
    :max="max"
    class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full w-[200px]" />
</template>
<script lang="ts" setup>
import { NeoStepper } from '@kodadot1/brick'
import useDropMassMintRefs from '@/composables/drop/massmint/useDropMassMintRefs'

const { amountToMint } = useDropMassMintRefs()

const max = inject('amountAvailableNFTs') as number | undefined
</script>
