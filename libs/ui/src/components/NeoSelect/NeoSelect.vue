<template>
  <NeoField :message="description" class="neo-select">
    <o-field :label="label">
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
  </NeoField>
</template>

<script lang="ts" setup>
import { OField, OSelect } from '@oruga-ui/oruga'
import NeoField from '../NeoInput/NeoField.vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  options: {
    type: () => [] as { value: string; text: string }[],
    required: true,
  },
})

const hasLabel = computed(() => props.label.length > 0)
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>
