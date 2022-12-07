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

<style lang="scss"></style>
