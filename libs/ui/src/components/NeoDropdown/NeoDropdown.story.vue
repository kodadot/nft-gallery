<template>
  <Story title="NeoDropdown" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="With Text">
      {{ label }}
      <template #items>
        <NeoDropdownItem
          v-for="(option, index) in options"
          :key="index"
          :item="option" />
      </template>
    </Variant>
    <Variant title="With Button">
      <NeoDropdown>
        <NeoButton :label="label" />

        <template #items>
          <NeoDropdownItem
            v-for="(option, index) in options"
            :key="index"
            :item="option" />
        </template>
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
