<template>
  <o-select
    v-model="selected"
    :placeholder="placeholder"
    class="neo-select"
    :class="{ 'o-ctrl-sel--expanded': expanded }"
    icon-right="chevron-down">
    <option
      v-for="(option, index) in selectOptions"
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
    type: [String, Number, Object],
    default: null,
  },
  textKey: {
    type: [Function, String],
    default: 'text',
  },
  valueKey: {
    type: [Function, String],
    default: 'value',
  },
})

console.log('Value', props.value)
console.log('Options', props.options)

const mapToSelectOption = (value) => {
  if (typeof value === 'object') {
    return {
      value:
        typeof props.valueKey === 'string'
          ? value[props.valueKey]
          : props.valueKey(value),
      text:
        typeof props.textKey === 'string'
          ? value[props.textKey]
          : props.textKey(value),
    }
  }
  return {
    value: typeof props.valueKey === 'function' ? props.valueKey(value) : value,
    text: typeof props.textKey === 'function' ? props.textKey(value) : value,
  }
}

const selectOptions = computed(() => props.options.map(mapToSelectOption))

const emit = defineEmits(['input'])

const selected = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>
