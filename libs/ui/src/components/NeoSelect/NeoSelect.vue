<template>
  <o-field :label="label">
    <o-select placeholder="Select a name">
      <option value="flint">Flint</option>
      <option value="silver">Silver</option>
    </o-select>
  </o-field>
</template>

<script lang="ts" setup>
import { OField, OSelect } from '@oruga-ui/oruga'

defineProps<{
  label?: string
}>()
</script>

<style lang="scss"></style>
