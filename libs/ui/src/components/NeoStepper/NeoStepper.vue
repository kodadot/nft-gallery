<template>
  <div>
    <NeoInput
      v-model="input"
      icon="minus"
      icon-right="plus"
      icon-clickable
      icon-right-clickable
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      steps="1"
      readonly
      @icon-click="handleLeftClick"
      @icon-right-click="handleRightClick" />
  </div>
</template>

<script setup lang="ts">
import NeoInput from '../NeoInput/NeoInput.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    disabled?: boolean
  }>(),
  {
    min: 1,
    max: undefined,
    disabled: false,
  },
)

const input = useVModel(props, 'modelValue')

const handleLeftClick = () => {
  if (input.value === props.min || props.disabled) {
    return
  }

  input.value--
}

const handleRightClick = () => {
  if (input.value === props.max || props.disabled) {
    return
  }

  input.value++
}
</script>
