<template>
  <Story>
    <NeoField :label="label">
      <NeoSelect :placeholder="placeholder" :options="options" />
    </NeoField>
  </Story>
</template>

<script lang="ts" setup>
import NeoSelect from './NeoSelect.vue'
import NeoField from '../NeoInput/NeoField.vue'

const label = 'Select something'
const placeholder = 'Select...'
const options = [
  { value: 'opt1', text: 'Option1' },
  { value: 'opt2', text: 'Option2' },
  { value: 'opt3', text: 'Option3' },
]
</script>
