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
  }>(),
  {
    min: 1,
    max: undefined,
  },
)

const input = useVModel(props, 'modelValue')

const handleLeftClick = () => {
  if (input.value === props.min) {
    return
  }

  input.value--
}

const handleRightClick = () => {
  if (input.value === props.max) {
    return
  }

  input.value++
}
</script>
