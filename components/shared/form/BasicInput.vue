<template>
  <NeoField :label="$i18n.t(label)">
    <template v-if="message" #label>
      <div>{{ $i18n.t(label) }}</div>
      <div class="has-text-weight-light is-size-7 mb-3">
        {{ message }}
      </div>
    </template>
    <NeoInput
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :expanded="expanded"
      :maxlength="maxlength"
      :required="required"
      :disabled="disabled"
      :has-counter="hasCounter"
      :type="type"
      :pattern="!value && required ? `^\\S+` : '.*'"
      @blur="hasFocus = false"
      @focus="hasFocus = true"
      @input="handleInput" />
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput } from '@kodadot1/brick'

const { $i18n } = useNuxtApp()

withDefaults(
  defineProps<{
    value?: string
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
    value: '',
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
const emit = defineEmits(['input'])
const input = ref(null)

function checkValidity() {
  return input.value?.checkHtml5Validity()
}

const handleInput = (value: string) => {
  emit('input', value.trim())
}

defineExpose({ checkValidity })
</script>
