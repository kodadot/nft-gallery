<template>
  <NeoField class="mt-4" :label="$t(label)">
    <NeoSlider
      v-model="value"
      :min="min"
      :max="max"
      :ticks="ticks"
      :lazy="lazy" />
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoSlider } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    label: string
    min?: number
    max?: number
    ticks?: boolean
    lazy?: boolean
    modelValue: number
  }>(),
  {
    min: 0,
    max: 100,
  }
)

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
