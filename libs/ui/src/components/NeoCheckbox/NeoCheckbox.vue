<template>
  <o-checkbox
    :model-value="checkboxValue"
    class="neo-checkbox"
    :native-value="checkboxValue"
    :disabled="disabled"
    :label-class="labelClass"
    @update:modelValue="updateValue">
    <slot />
  </o-checkbox>
</template>

<script lang="ts" setup>
import { OCheckbox } from '@oruga-ui/oruga-next'
const props = defineProps<{
  disabled?: boolean
  modelValue: boolean
  labelClass?: string
}>()

const emit = defineEmits(['update:modelValue'])
const checkboxValue = useVModel(props, 'modelValue')
const updateValue = (event) => {
  emit('update:modelValue', event)
}
</script>

<style lang="scss">
@import './NeoCheckbox.scss';
</style>
