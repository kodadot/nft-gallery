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

const { decimals, unit } = useChain()

const displayUnit = computed(() => props.unitSymbol || unit.value)
const finalValue = computed(() =>
  round(
    formatBalance(checkInvalidBalanceFilter(props.value), decimals.value, ''),
    props.round,
    false
  )
)

const round = (value: string, limit: number, disableFilter: boolean) => {
  const number = Number(value.replace(/,/g, ''))
  if (disableFilter) {
    return parseFloat(number.toString())
  }
  return roundTo(value, limit)
}
</script>
