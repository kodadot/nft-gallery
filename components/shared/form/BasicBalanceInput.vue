<template>
  <NeoField :label="$t(label)">
    <NeoInput
      ref="balance"
      v-model="metaValue"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :disabled="disabled"
      :expanded="expanded"
      :placeholder="placeholder"
      data-testid="balance-input"
      :use-html5-validation="true"
      @blur="onBlur" />
    <p class="control">
      <span data-testid="balance-input-label" class="button is-static">{{
        unit
      }}</span>
    </p>
  </NeoField>
</template>

<script setup lang="ts">
import { balanceFrom, simpleDivision } from '@/utils/balance'
import { useVModel } from '@vueuse/core'
import { NeoField, NeoInput } from '@kodadot1/brick'

const props = defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  unit: {
    type: String,
    default: '-',
  },
  decimals: {
    type: Number,
    default: 12,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
  step: {
    type: Number,
    default: 0.001,
  },
  label: {
    type: String,
    default: 'amount',
  },
  placeholder: {
    type: String,
    default: '1',
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['input'])

const vValue = useVModel(props, 'value', emit, { eventName: 'input' })
const balance = ref<InstanceType<typeof NeoInput>>()

const metaValue = computed({
  get: () => simpleDivision(vValue.value, props.decimals),
  set: (value) => handleInput(value),
})

function handleInput(value: number | string) {
  checkValidity()
  let v = '0'
  try {
    v = balanceFrom(value, props.decimals)
  } catch (e) {
    console.warn(e)
  }
  emit('input', v)
}

function onBlur() {
  checkValidity()
}

function focusInput() {
  balance.value?.focus()
}

function checkValidity() {
  return balance.value?.checkHtml5Validity()
}

defineExpose({
  focusInput,
  checkValidity,
})
</script>
