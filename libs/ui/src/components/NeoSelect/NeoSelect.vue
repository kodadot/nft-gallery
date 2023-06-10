<template>
  <NeoField :message="description" class="neo-select">
    <o-field :label="label">
      <o-select
        :placeholder="placeholder"
        :class="{ 'with-label': !!label }"
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

defineProps<{
  label?: string
  placeholder?: string
  description?: string
  options: { value: string; text: string }[]
}>()
</script>

<style lang="scss">
@import './NeoSelect.scss';
</style>
