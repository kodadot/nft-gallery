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

const props = defineProps<{
  value: string | undefined
}>()

const { format: formatPrice } = useFormatAmount()
const { amount } = formatPrice(props.value || '')
</script>
