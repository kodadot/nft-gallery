<template>
  <div
    v-if="trade"
    class="!pt-5"
  >
    <TradeOwnerButton
      class="!w-full"
      :trade="trade"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import { type TradeNftItem } from '@/components/trade/types'

defineEmits(['submit'])
defineProps<{
  trade: TradeNftItem
  disabled?: boolean
}>()
</script>
