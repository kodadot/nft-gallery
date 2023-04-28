<template>
  <BasicMoney
    :value="value"
    :unit="chainSymbol"
    :decimals="decimals"
    :inline="inline"
    :hide-unit="hideUnit" />
</template>

<script setup lang="ts">
import BasicMoney from '@/components/shared/format/BasicMoney.vue'

const { chainSymbol, decimals } = useChain()

withDefaults(
  defineProps<{
    value: number | string | undefined
    inline?: boolean
    hideUnit?: boolean
  }>(),
  {
    value: '0',
  }
)
</script>
