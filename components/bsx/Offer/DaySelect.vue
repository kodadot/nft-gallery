<template>
  <NeoSelect
    v-model="selectedDays"
    :label="$t('offer.daySelectLabel')"
    :placeholder="$t('offer.daySelectPlaceholder')"
    :options="selectOptions"
    expanded />
</template>

<script lang="ts" setup>
import { NeoSelect } from '@kodadot1/brick'

const props = defineProps({
  days: {
    type: Array as () => number[],
    default: () => [],
  },
  modelValue: {
    type: Number,
    default: 14,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedDays = useVModel(props, 'modelValue', emit)

const selectOptions = computed(() => [
  { text: '--', value: '' },
  ...props.days.map((day) => ({
    value: day,
    text: day,
  })),
])
</script>
