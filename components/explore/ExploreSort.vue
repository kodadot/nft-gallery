<template>
  <div>
    <p>{{ selectedSort }}</p>
    <o-dropdown v-model="selectedSort" multiple aria-role="list">
      <template #trigger>
        <NeoButton type="button">
          <span>Sort By: {{ selectedSort.length }}</span>
        </NeoButton>
      </template>

      <NeoDropdownItem
        v-for="option in options"
        :key="option.value"
        aria-role="listitem"
        :value="option.value">
        <span>{{ option.text }}</span>
      </NeoDropdownItem>
    </o-dropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdownItem } from '@kodadot1/brick'
import { ODropdown } from '@oruga-ui/oruga'

const selectedSort = ref([])
const options = [
  {
    value: 'price_ASC',
    text: 'Price: Low to High',
  },
  {
    value: 'price_DESC',
    text: 'Price: High to Low',
  },
  {
    value: 'created_ASC',
    text: 'Created: Old to New',
  },
  {
    value: 'created_DESC',
    text: 'Created: New to Old',
  },
]
</script>

<style scoped></style>
