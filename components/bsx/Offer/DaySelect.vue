<template>
  <NeoSelect
    v-model="selectedDays"
    :label="$t('offer.daySelectLabel')"
    :placeholder="$t('offer.daySelectPlaceholder')"
    :options="days"
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
</script>
