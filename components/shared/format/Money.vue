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
import {
  checkInvalidBalanceFilter,
  default as formatBalance,
  roundTo,
} from '@/utils/format/balance'

const props = withDefaults(
  defineProps<{
    value?: number | string
    inline: boolean
    hideUnit?: boolean
    unitSymbol?: string
    decimals?: number
    round?: number
  }>(),
  {
    value: 0,
    round: 4,
    unitSymbol: '',
  }
)

const { decimals: chainDecimals, unit } = useChain()

const displayUnit = computed(() => props.unitSymbol || unit.value)
const decimals = computed(() => props.decimals || chainDecimals.value)

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
