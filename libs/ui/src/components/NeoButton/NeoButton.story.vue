<template>
  <Story title="NeoButton" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="small neo button">
      <NeoButton :label="label" size="small" />
    </Variant>
    <Variant title="default neo button">
      <NeoButton :label="label" />
    </Variant>
    <Variant title="medium neo button">
      <NeoButton :label="label" size="medium" />
    </Variant>
    <Variant title="large neo button">
      <NeoButton :label="label" size="large" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoButton from './NeoButton.vue'

const label = 'Sample'
</script>
