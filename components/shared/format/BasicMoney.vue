<template>
  <div :class="['money', { 'inline-block': inline }]">
    <div>
      {{ finalValue }}
      {{ realUnit }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import formatBalance, { checkInvalidBalanceFilter, roundTo } from '@/utils/format/balance'

const props = withDefaults(
  defineProps<{
    value?: number | string | undefined
    hideUnit?: boolean
    inline?: boolean
    round: number
  }>(),
  {
    value: 0,
    round: 4,
  },
)

const { decimals, chainSymbol } = useChain()

const realUnit = computed(() => (props.hideUnit ? '' : ' ' + chainSymbol.value))

const finalValue = computed(() =>
  roundValue(
    formatBalance(checkInvalidBalanceFilter(props.value), decimals.value, ''),
    props.round,
    false,
  ),
)

const roundValue = (value: string, limit: number, disableFilter: boolean) => {
  const number = Number(value.replace(/,/g, ''))
  if (disableFilter) {
    return parseFloat(number.toString())
  }
  return roundTo(value, limit)
}
</script>
