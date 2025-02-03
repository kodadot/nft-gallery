<template>
  <NeoTag
    v-if="config"
    size="small"
    :variant="config.variant"
    class="w-min"
  >
    <span> {{ config.label }} </span>
  </NeoTag>
</template>

<script setup lang="ts">
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import type { SwapSurcharge } from '@/composables/transaction/types'

const props = defineProps<{
  value: SwapSurcharge | undefined
}>()

const { $i18n } = useNuxtApp()
const { format: formatPrice } = useFormatAmount()
const { amount } = formatPrice(props.value?.amount || '')

const config = computed(() => {
  if (!props.value) {
    return
  }

  return props.value.direction === 'Receive'
    ? ({ label: $i18n.t('trades.requests', [amount]), variant: 'k-orange' as const })
    : ({ label: `+${amount}`, variant: 'k-blue-2' as const })
})
</script>
