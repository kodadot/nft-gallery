<template>
  <o-input
    v-model="inputValue"
    :placeholder="placeholder"
    class="neo-input"
    v-bind="$attrs"
    :style="heightStyle"
    :type="type"
    :maxlength="maxlength"
    :min="min"
    :max="max"
    :step="step"
    :validation-message="validationMessage"
    :expanded="expanded"
    :use-html5-validation="useHtml5Validation"
    :disabled="disabled"
    @input="updateValue" />
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga'

const props = defineProps<{
  value: string | number
  height?: number | string
  type?: string
  placeholder?: string
  maxlength?: number
  min?: number
  max?: number
  step?: number
  expanded?: boolean
  disabled?: boolean
  useHtml5Validation?: boolean
  customClass?: string
  validationMessage?: string
}>()
const emit = defineEmits(['input'])

const inputValue = useVModel(props, 'value')
const updateValue = (event) => {
  emit('input', event)
}

const heightStyle = computed(() => {
  if (props.height) {
    return {
      '--neo-input-height':
        typeof props.height === 'number' ? `${props.height}px` : props.height,
    }
  }
  return {}
})
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
