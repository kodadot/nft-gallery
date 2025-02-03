<template>
  <NeoTag
    v-if="value"
    size="small"
    variant="k-blue-2"
    class="w-min"
  >
    <span> +{{ amount }} </span>
  </NeoTag>
</template>

<script setup lang="ts">
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import type { SwapSurcharge } from '@/composables/transaction/types'

const props = defineProps<{
  value: SwapSurcharge | undefined
}>()

const { format: formatPrice } = useFormatAmount()
const { amount } = formatPrice(props.value?.amount || '')
</script>
