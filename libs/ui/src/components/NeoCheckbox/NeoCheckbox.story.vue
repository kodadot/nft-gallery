<template>
  <Story title="NeoCheckbox" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Small NeoCheckbox">
      <NeoCheckbox size="small"> {{ label }} </NeoCheckbox>
    </Variant>
    <Variant title="Default NeoCheckbox">
      <NeoCheckbox> {{ label }} </NeoCheckbox>
    </Variant>
    <Variant title="Large NeoCheckbox">
      <NeoCheckbox size="large"> {{ label }} </NeoCheckbox>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoCheckbox from './NeoCheckbox.vue'

const label = 'Sample'
</script>
