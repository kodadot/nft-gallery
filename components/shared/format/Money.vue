<template>
  <div :class="['money', { 'is-inline-block': inline }]">
    <span v-if="!hideUnit">
      {{
        value | checkInvalidBalance | formatBalance(decimals, '') | round(round)
      }}
      {{ displayUnit }}
    </span>
    <span v-else>
      {{
        value | checkInvalidBalance | formatBalance(decimals, '') | round(round)
      }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { checkInvalidBalanceFilter, roundTo } from '@/utils/format/balance'
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
      return roundTo(value, limit)
    },
  },
})
export default class Money extends mixins(ChainMixin) {
  @Prop({ default: 0 }) readonly value: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean
  @Prop({ type: String }) readonly unitSymbol!: string
  @Prop({ type: Number, default: 4 }) readonly round!: number

  private readonly coinId: string = 'kusama'

  get isBsx() {
    return this.urlPrefix === 'bsx'
  }

  get displayUnit() {
    return this.unitSymbol || this.unit
  }
}
</script>
