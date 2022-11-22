<template>
  <Story title="NeoDropDown" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="small neo button">
      <NeoDropdown :label="label" size="small" />
    </Variant>
    <!-- <Variant title="default neo button">
      <NeoDropdown :label="label" />
    </Variant>
    <Variant title="medium neo button">
      <NeoDropdown :label="label" size="medium" />
    </Variant>
    <Variant title="large neo button">
      <NeoDropdown :label="label" size="large" />
    </Variant> -->
  </Story>
</template>

<script lang="ts" setup>
import NeoDropdown from './NeoDropdown.vue'

const label = 'Sample'
</script>
