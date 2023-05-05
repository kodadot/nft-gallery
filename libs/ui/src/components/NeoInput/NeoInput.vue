<template>
  <o-input
    v-model="inputValue"
    class="neo-input"
    :type="type"
    :maxlength="maxlength"
    :min="min"
    :max="max"
    :step="step"
    :validation-message="validationMessage"
    :expanded="expanded"
    :placeholder="placeholder"
    :use-html5-validation="useHtml5Validation"
    :disabled="disabled"
    v-bind="$attrs"
    @input="updateValue">
  </o-input>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'
import { OInput } from '@oruga-ui/oruga'

const props = defineProps<{
  type?: string
  placeholder?: string
  maxlength?: number
  min?: number
  max?: number
  step?: number
  expanded?: boolean
  disabled?: boolean
  useHtml5Validation?: boolean
  value?: string
  customClass?: string
  validationMessage?: string
}>()

const emit = defineEmits(['input'])
const inputValue = useVModel(props, 'value')
const updateValue = (event) => {
  emit('input', event)
}
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
