<template>
  <NeoField :label="$i18n.t(label)">
    <template v-if="message" #label>
      <div>{{ $i18n.t(label) }}</div>
      <div class="font-light text-xs mb-3">
        {{ message }}
      </div>
    </template>
    <NeoInput
      ref="input"
      v-model="vValue"
      :placeholder="placeholder"
      :expanded="expanded"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      :has-counter="hasCounter"
      :type="type"
      :pattern="!vValue && required ? `^\\S+` : '.*'"
      @blur="hasFocus = false"
      @focus="hasFocus = true"
      @input="handleInput" />
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput } from '@kodadot1/brick'

const { $i18n } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label: string
    placeholder: string
    expanded?: boolean
    message?: string
    maxlength?: string | number
    type?: string
    required?: boolean
    disabled?: boolean
    hasCounter?: boolean
  }>(),
  {
    modelValue: '',
    expanded: false,
    type: '',
    message: '',
    required: false,
    disabled: false,
    hasCounter: true,
    maxlength: undefined,
  },
)

const hasFocus = ref(false)
const emit = defineEmits(['update:modelValue'])
const input = ref(null)

function checkValidity() {
  return input.value?.checkHtml5Validity()
}

const vValue = useVModel(props, 'modelValue', emit)

const handleInput = (value: string) => {
  emit('update:modelValue', value.trim())
}

defineExpose({ checkValidity })
</script>
