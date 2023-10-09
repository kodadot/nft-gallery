<template>
  <BasicMoney
    :value="value"
    :inline="inline"
    :hide-unit="hideUnit"
    :round="round" />
</template>

<script lang="ts" setup>
import BasicMoney from '@/components/shared/format/BasicMoney.vue'

withDefaults(
  defineProps<{
    value: number | string | undefined
    inline: boolean
    hideUnit?: boolean
    round?: number
  }>(),
  {
    value: '0',
    round: 4,
  }
)
</script>
