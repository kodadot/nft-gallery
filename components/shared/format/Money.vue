<template>
  <div :class="['money', { 'money--inline': inline }]">
    <span v-if="!hideUnit">
      {{ value | checkInvalid | formatBalance(decimals, unit) }}
    </span>
    <span v-else>
      {{ value | checkInvalid | formatBalance(decimals, '') | round(2) }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  filters: {
    checkInvalid: (value) => {
      if (value === Infinity) return '0'
      return value
    },
    round: function roundOffNumber(value, limit) {
      return Number(value.replace(/,/g, '')).toFixed(limit)
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
