<template>
  <NeoField :label="$t('offer.daySelectLabel')">
    <NeoSelect
      v-model="selectedDays"
      :placeholder="$t('offer.daySelectPlaceholder')"
      :options="days"
      expanded />
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoSelect } from '@kodadot1/brick'

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
