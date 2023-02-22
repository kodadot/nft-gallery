<template>
  <Story title="NeoButton" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="small neo button">
      <NeoCheckbox> test </NeoCheckbox>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoCheckbox from './NeoCheckbox.vue'

const label = 'Sample'
</script>
