<template>
  <div :class="['money is-ellipsis', { 'is-inline-block': inline }]">
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
import { chainPropListOf } from '@/utils/config/chain.config'
import type { Prefix } from '@kodadot1/static'

const props = withDefaults(
  defineProps<{
    value?: number | string
    inline: boolean
    hideUnit?: boolean
    unitSymbol?: string
    prefix?: Prefix
    round?: number
  }>(),
  {
    value: 0,
    round: 4,
    unitSymbol: '',
    prefix: undefined,
  },
)

const { decimals, unit } = useChain()

const tokenDecimals = computed(() =>
  props.prefix ? chainPropListOf(props.prefix).tokenDecimals : decimals.value,
)
const displayUnit = computed(
  () =>
    props.unitSymbol ||
    (props.prefix ? chainPropListOf(props.prefix).tokenSymbol : unit.value),
)
const finalValue = computed(() =>
  round(
    formatBalance(
      checkInvalidBalanceFilter(props.value),
      tokenDecimals.value,
      '',
    ),
    props.round,
    true,
  ),
)

const round = (value: string, limit: number, disableFilter: boolean) => {
  const number = Number(value.replace(/,/g, ''))
  if (disableFilter) {
    return parseFloat(number.toString())
  }
  return roundTo(value, limit)
}
</script>
