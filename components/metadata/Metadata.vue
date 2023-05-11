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
  </div>
</template>

<script setup lang="ts">
const { chainProperties } = useChain()
</script>
