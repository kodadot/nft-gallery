<template>
  <o-select
    v-model="selected"
    :placeholder="placeholder"
    class="neo-select"
    :class="{ 'is-expanded': expanded }"
    icon-right="chevron-down">
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.value">
      {{ option.text }}
    </option>
  </o-select>
</template>

<script setup>
import { OSelect } from '@oruga-ui/oruga'
const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['input'])

const selected = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>
