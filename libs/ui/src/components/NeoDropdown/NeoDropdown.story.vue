<template>
  <Story title="NeoDropdown" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="With Text">
      <NeoDropdown :items="options">
        {{ label }}
      </NeoDropdown>
    </Variant>
    <Variant title="With Button">
      <NeoDropdown :items="options">
        <NeoButton :label="label" />
      </NeoDropdown>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoDropdown from './NeoDropdown.vue'
import NeoButton from '../NeoButton/NeoButton.vue'

const label = 'Select something'
const options = ['Action', 'Another action', 'Something else']
</script>
