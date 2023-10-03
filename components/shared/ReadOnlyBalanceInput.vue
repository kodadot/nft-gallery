<template>
  <div class="arguments-wrapper">
    <NeoField :label="$t(labelInput)" class="balance">
      <NeoInput
        v-model="inputValue"
        type="number"
        step="0.001"
        min="0"
        @input="handleInput" />
      <div class="option">
        {{ label }}
      </div>
    </NeoField>
  </div>
</template>

<script lang="ts" setup>
import { units as defaultUnits } from '@/params/constants'
import { Unit } from '@/params/types'
import { NeoField, NeoInput } from '@kodadot1/brick'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  label: { type: String, default: 'USD' },
  labelInput: { type: String, default: 'balance' },
})

const { unit } = useChain()
const emit = defineEmits(['input'])
const units = ref<Unit[]>(defaultUnits)

const handleInput = (value) => {
  emit('input', value)
  return value
}

const inputValue = computed({
  get: () => props.value,
  set: (value) => handleInput(value),
})

const mapper = (newunit: Unit) => {
  if (newunit.name === '-') {
    return { ...newunit, name: unit.value }
  }
  return newunit
}

onMounted(() => {
  units.value = defaultUnits.map(mapper)
})
</script>

<style scoped lang="scss">
.option {
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  padding: 0rem 2.3rem;
}
</style>
