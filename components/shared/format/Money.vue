<template>
  <div :class="['money', { 'is-inline-block': inline }]">
    <span v-if="!hideUnit">
      {{
        value |
          checkInvalidBalance |
          formatBalance(decimals, '') |
          round(2, !isBsx)
      }}
      {{ unit }}
    </span>
    <span v-else>
      {{ value | checkInvalidBalance | formatBalance(decimals, '') | round(2) }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { checkInvalidBalanceFilter } from '@/utils/formatBalance'
import ChainMixin from '@/utils/mixins/chainMixin'

@Component({
  filters: {
    checkInvalidBalance: checkInvalidBalanceFilter,
    round: function roundOffNumber(
      value: string,
      limit: number,
      disableFilter: boolean
    ) {
      const number = Number(value.replace(/,/g, ''))
      if (disableFilter) {
        return parseFloat(number.toString())
      }

      const hasDecimals = number % 1 !== 0
      // `undefined` params in toLocaleString() means use host default language
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
      const fractionDigits = hasDecimals ? limit : 0
      return number.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })
    },
  },
})
export default class Money extends mixins(ChainMixin) {
  @Prop({ default: 0 }) readonly value: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean

  private readonly coinId: string = 'kusama'

  get isBsx() {
    return this.urlPrefix === 'bsx'
  }
}
</script>
