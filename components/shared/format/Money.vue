<template>
  <div :class="['money', { 'is-inline-block': inline }]">
    <span v-if="!hideUnit">
      {{ finalValue }}
      {{ displayUnit }}
    </span>
    <span v-else>
      {{ finalValue }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { checkInvalidBalanceFilter, roundTo } from '@/utils/format/balance'
import formatBalance from '@/utils/format/balance'

const finalValue = computed(() => {
  return roundTo(
    formatBalance(checkInvalidBalanceFilter(props.value), decimals.value, '')
  )
})

const { decimals, unit } = useChain()

const props = withDefaults(
  defineProps<{
    value?: number | string | undefined
    inline: boolean
    hideUnit: boolean
    unitSymbol: string
    round: number
  }>(),
  {
    value: 0,
    round: 4,
  }
)

const displayUnit = computed(() => props.unitSymbol || unit.value)
</script>
