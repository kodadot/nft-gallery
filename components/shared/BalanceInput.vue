<template>
  <div class="arguments-wrapper">
    <NeoField
      :label="$t(label)"
      class="balance"
      :variant="checkZeroFailed ? 'danger' : ''">
      <div class="field-body">
        <div class="field has-addons">
          <NeoInput
            ref="balance"
            v-model="inputValue"
            :required="required"
            type="number"
            :step="step"
            :min="minWithUnit"
            :max="maxWithUnit"
            :expanded="expanded"
            data-testid="balance-input"
            @input="handleInput" />
          <p class="control balance">
            <NeoSelect
              :value="selectedUnit"
              :disabled="!calculate"
              data-testid="balance-input-select"
              @input="handleUnitChange">
              <option v-for="u in units" :key="u.value" :value="u.value">
                {{ u.name }}
              </option>
            </NeoSelect>
          </p>
        </div>
      </div>
      <p v-if="checkZeroFailed" class="help is-danger">
        {{ $t('tooltip.needToSetValidPrice') }}
      </p></NeoField
    >
  </div>
</template>

<script setup lang="ts">
import { units as defaultUnits } from '@/params/constants'
import { Unit } from '@/params/types'
import { useDebounceFn } from '@vueuse/core'
import { NeoField, NeoInput, NeoSelect } from '@kodadot1/brick'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: 'amount',
  },
  calculate: {
    type: Boolean,
    default: true,
  },
  expanded: Boolean,
  step: {
    type: Number,
    default: 0.001,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
  required: {
    type: Boolean,
    default: false,
  },
  hasToLargerThanZero: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['input'])
const selectedUnit = ref(1)
const internalValue = ref(props.value || 0)
const checkZeroFailed = ref(false)
const { decimals, unit: chainUnit } = useChain()

const mapper = (unit: Unit) => {
  if (unit.name === '-') {
    return { ...unit, name: chainUnit.value }
  }
  return unit
}

const units = ref<Unit[]>(defaultUnits.map(mapper))

const minWithUnit = computed(() => props.min / selectedUnit.value)
const maxWithUnit = computed(() => props.max / selectedUnit.value)

watch(
  () => props.value,
  (newValue) => {
    internalValue.value = newValue
  },
)

const balance = ref(null)
const inputValue = computed({
  get: () => internalValue.value,
  set: (value) => {
    handleInput(value)
  },
})

const formatSelectedValue = (value: number): string => {
  return value ? String(value * 10 ** decimals.value * selectedUnit.value) : '0'
}

const handleInput = useDebounceFn((value: number) => {
  internalValue.value = value
  const valueInBaseUnit = internalValue.value * selectedUnit.value
  const formattedValue = props.calculate
    ? formatSelectedValue(valueInBaseUnit)
    : valueInBaseUnit

  emits('input', formattedValue)
  return formattedValue
}, 200)

const handleUnitChange = (unit: number) => {
  const valueInBaseUnit = internalValue.value * selectedUnit.value
  internalValue.value = valueInBaseUnit ? valueInBaseUnit / unit : 0
  selectedUnit.value = unit
  balance.value?.focus()
}

const checkValidity = () => {
  const valueEqualZero = inputValue.value.toString() === '0'
  checkZeroFailed.value = props.hasToLargerThanZero && valueEqualZero
  const balanceInputValid = balance.value?.checkHtml5Validity() ?? false
  return balanceInputValid && !checkZeroFailed.value
}

defineExpose({
  checkValidity,
})
</script>
