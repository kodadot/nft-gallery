<template>
  <div :class="['money', { 'money--inline': inline }]">
    <span>
      {{ value | formatBalance(decimals, unit) }}
    </span>
    <span v-if="fiatValue">
      / {{ fiatValue | formatBalance(decimals, showFiatValue.toUpperCase()) }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios'

@Component
export default class Money extends Vue {
  @Prop({default: 0}) readonly value: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
  @Prop({default: ''}) readonly showFiatValue!: string

  private readonly apiUrl: string = 'https://api.coingecko.com/api/v3'
  private readonly coinId: string = 'kusama'
  private fiatValue: number = 0

  get chainProperties() {
    return this.$store.getters.getChainProperties
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol
  }

  public created() {
    if (this.showFiatValue) {
      this.getFiatValue()
    }
  }

  private async getFiatValue() {
    try {
      const { data } = await axios.get(`${this.apiUrl}/simple/price`, {
        params: {
          ids: this.coinId,
          vs_currencies: this.showFiatValue
        }
      })

      this.fiatValue = data[this.coinId][this.showFiatValue] * Number(this.value)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss">
  .money {
    &--inline {
      display: inline-block;
    }
  }
</style>
