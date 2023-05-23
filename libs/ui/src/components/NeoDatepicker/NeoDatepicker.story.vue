<template>
  <Story title="NeoDatepicker">
    <Variant title="NeoDatepicker">
      <NeoDatepicker
        v-model="selected"
        placeholder="Click to select..."
        icon="calendar"
        trap-focus>
      </NeoDatepicker>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NeoDatepicker from './NeoDatepicker.vue'

const selected = ref(new Date())
</script>
