<template>
  <div :class="['money', { 'money--inline': inline }]">
    <span v-if="!hideUnit">
      {{ value | checkInvalidBalance | formatBalance(decimals, unit) }}
    </span>
    <span v-else>
      {{ value | checkInvalidBalance | formatBalance(decimals, '') | round(2) }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { checkInvalidBalanceFilter } from '@/utils/formatBalance'
@Component({
  filters: {
    checkInvalidBalance: checkInvalidBalanceFilter,
    round: function roundOffNumber(value, limit) {
      // `undefined` params in toLocaleString() means use host default language
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
      return Number(value.replace(/,/g, '')).toLocaleString(undefined, {
        minimumFractionDigits: limit,
        maximumFractionDigits: limit,
      })
    },
  },
})
export default class Money extends Vue {
  @Prop({ default: 0 }) readonly value: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean

  private readonly coinId: string = 'kusama'
  private fiatValue = 0

  get chainProperties() {
    return this.$store.getters['chain/getChainProperties']
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol
  }
}
</script>

<style scoped lang="scss">
.money {
  &--inline {
    display: inline-block;
  }
}
</style>
