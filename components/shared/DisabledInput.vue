<template>
  <b-field :label="label" :expanded="expanded">
    <b-input :value="value" :readonly="readonly" disabled></b-input>
  </b-field>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label: string
    value: string
    expanded: boolean
    readonly: boolean
  }>(),
  {
    label: '',
    value: '',
    expanded: false,
    readonly: false,
  }
)
  label: string
  value: string
  expanded: boolean
  readonly: boolean
}>(),
  {
    label: '',
    value: '',
    expanded: false,
    readonly: false,
  }
</script>
