<template>
  <o-checkbox
    v-model="checkboxValue"
    class="neo-checkbox"
    :native-value="checkboxValue"
    :disabled="disabled"
    :label-class="labelClass"
    @input="updateValue">
    <slot />
  </o-checkbox>
</template>

<script lang="ts" setup>
import { OCheckbox } from '@oruga-ui/oruga'
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
