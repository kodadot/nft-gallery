<template>
  <Story>
    <NeoSelect :label="label" />
  </Story>
</template>

<script lang="ts" setup>
import NeoSelect from './NeoSelect.vue'

const label = 'Select something'
</script>
