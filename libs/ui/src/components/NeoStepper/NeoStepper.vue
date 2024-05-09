<template>
  <div>
    <NeoInput
      v-model="input"
      icon="minus"
      icon-right="plus"
      icon-clickable
      icon-right-clickable
      class="text-center"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      @icon-click="handleLeftClick"
      @icon-right-click="handleRightClick" />
  </div>
</template>

<script setup lang="ts">
import NeoInput from '../NeoInput/NeoInput.vue'
const props = withDefaults(
  defineProps<{
    modelValue: number | ''
    min?: number
    max?: number
    disabled?: boolean
  }>(),
  {
    min: 0,
    max: Infinity,
    disabled: false,
  },
)
const input = useVModel(props, 'modelValue')
const handleLeftClick = () => {
  if (input.value === '' || input.value === props.min || props.disabled) {
    return
  }
  input.value--
}
const handleRightClick = () => {
  if (input.value === '' || input.value === props.max || props.disabled) {
    return
  }
  input.value++
}

watchEffect(() => {
  if (input.value !== '') {
    if (input.value < props.min) {
      input.value = props.min
    } else if (input.value > props.max) {
      input.value = props.max
    }
  }
})
</script>
