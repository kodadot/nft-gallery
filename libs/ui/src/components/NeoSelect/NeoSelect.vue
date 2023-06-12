<template>
  <o-field
    :label="label"
    class="neo-select"
    :class="{ 'is-expanded': expanded }">
    <o-select
      :placeholder="placeholder"
      :class="{ 'with-label': hasLabel }"
      icon-right="chevron-down">
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value">
        {{ option.text }}
      </option>
    </o-select>
  </o-field>
</template>

<script lang="ts" setup>
import { OField, OSelect } from '@oruga-ui/oruga'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: Array as () => { value: string; text: string }[],
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
})

const hasLabel = computed(() => props.label.length > 0)
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>
