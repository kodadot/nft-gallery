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
  value: boolean
  labelClass?: string
}>()

const emit = defineEmits(['input'])
const checkboxValue = useVModel(props, 'value')
const updateValue = (event) => {
  emit('input', event)
}
</script>

<style lang="scss">
@import './NeoCheckbox.scss';
</style>
