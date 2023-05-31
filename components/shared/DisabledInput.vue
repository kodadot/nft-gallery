<template>
  <NeoField :label="label" :expanded="expanded">
    <NeoInput :value="value" :readonly="readonly" disabled></NeoInput>
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    label: string
    value: string
    expanded?: boolean
    readonly?: boolean
  }>(),
  {
    label: '',
    value: '',
    expanded: false,
    readonly: false,
  }
)
</script>
