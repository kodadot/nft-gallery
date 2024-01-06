<template>
  <Money :value="value" :data-testid="dataCy" inline :round="round" />
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'

defineProps({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  value: {
    type: [Number, String, BigInt],
    default: '0',
  },
  dataCy: {
    type: String,
    required: false,
    default: '',
  },
  round: {
    type: Number,
    default: 2,
  },
})
</script>
