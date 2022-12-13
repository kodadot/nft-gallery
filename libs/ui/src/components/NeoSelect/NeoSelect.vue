<template>
  <o-field :label="label">
    <o-select :placeholder="placeholder">
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

defineProps<{
  label?: string
  placeholder?: string
  options: { value: string; text: string }[]
}>()
</script>

<style lang="scss" scoped>
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

:root {
  /** Select **/
  --oruga-select-placeholder-opacity: 1;
  --oruga-select-border-radius: 0;
  --oruga-select-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  --oruga-select-arrow-size: 0.75rem;
  --oruga-select-padding: 8px 8px;
  --oruga-select-line-height: 1;
}
</style>
