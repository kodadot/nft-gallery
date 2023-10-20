<template>
  <Story title="NeoDropdown" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="With Text">
      <NeoDropdown>
        <template #trigger>{{ label }}</template>

        <NeoDropdownItem
          v-for="(option, index) in options"
          :key="index"
          :item="option" />
      </NeoDropdown>
    </Variant>
    <Variant title="With Button">
      <NeoDropdown>
        <template #trigger>
          <NeoButton :label="label" />
        </template>

        <NeoDropdownItem
          v-for="(option, index) in options"
          :key="index"
          :item="option" />
      </NeoDropdown>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoDropdown from './NeoDropdown.vue'
import NeoDropdownItem from './NeoDropdownItem.vue'
import NeoButton from '../NeoButton/NeoButton.vue'

const label = 'Select something'
const options = ['Action', 'Another action', 'Something else']
</script>
