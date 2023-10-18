<template>
  <div>
    <DisabledInput
      label="Address Prefix"
      :value="chainProperties.ss58Format.toString() || ''" />
    <DisabledInput
      label="Decimals"
      :value="chainProperties.tokenDecimals.toString() || ''" />
    <DisabledInput
      label="Unit"
      :value="chainProperties.tokenSymbol.toString() || ''" />
    <DisabledInput
      v-if="chainProperties.blockExplorer"
      label="Block Explorer"
      :value="chainProperties.blockExplorer?.toString() || ''" />
    <DisabledInput
      v-if="chainProperties.genesisHash"
      label="Genesis Hash"
      :value="chainProperties.genesisHash?.toString() || ''" />
    <NeoButton @click="refresh"> Clear Cache & Reload </NeoButton>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const { chainProperties } = useChain()
const refresh = () => {
  if (process.client) {
    window.location.reload()
  }
}
</script>
