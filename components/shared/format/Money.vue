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
import { chainPropListOf } from '@/utils/config/chain.config'

const props = defineProps({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  value: {
    type: [Number, String, BigInt],
    default: '0',
  },
  inline: {
    type: Boolean,
    default: false,
  },
  hideUnit: {
    type: Boolean,
    default: false,
  },
  unitSymbol: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: undefined,
  },
  round: {
    type: Number,
    default: 4,
  },
})

const { decimals, unit } = useChain()

const tokenDecimals = computed(() =>
  props.prefix ? chainPropListOf(props.prefix).tokenDecimals : decimals.value
)
const displayUnit = computed(() => props.unitSymbol || unit.value)
const finalValue = computed(() =>
  round(
    formatBalance(
      checkInvalidBalanceFilter(props.value),
      tokenDecimals.value,
      ''
    ),
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
