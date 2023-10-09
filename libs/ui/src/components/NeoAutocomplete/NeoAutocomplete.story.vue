<template>
  <Story title="NeoAutocomplete" :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Autocomplete">
      {{ label }}
      <template #items>
        <NeoAutocomplete placeholder="Search..." icon="search" icon-pack="fasr">
          <template #header>header</template>
        </NeoAutocomplete>
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoAutocomplete from './NeoAutocomplete.vue'

const label = 'Select something'
</script>
