<template>
  <div>
    <NeoInput
      v-model="input"
      icon="minus"
      icon-right="plus"
      icon-clickable
      icon-right-clickable
      type="number"
      :min="1"
      steps="1"
      @icon-click="handleLeftClick"
      @icon-right-click="handleRightClick" />
  </div>
</template>

<script setup lang="ts">
import NeoInput from '../NeoInput/NeoInput.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min: number
  }>(),
  {
    min: 1,
  },
)

const input = useVModel(props, 'modelValue')

const handleLeftClick = () => {
  if (input.value - 1 < props.min) {
    return
  }

  input.value--
}

const handleRightClick = () => {
  input.value++
}
</script>
