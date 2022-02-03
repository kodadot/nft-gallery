<template>
  <div :class="['money', { 'money--inline': inline }]">
    <span v-if="!hideUnit">
      {{ value | formatBalance(decimals, unit) }}
    </span>
    <span v-else>
      {{ valueWithoutUnit }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import formatBalance from '@/utils/formatBalance'

@Component
export default class Money extends Vue {
  @Prop({ default: 0 }) readonly value: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean

  private readonly coinId: string = 'kusama'
  private fiatValue = 0

  get valueWithoutUnit() {
    const value = formatBalance(Number(this.value), this.decimals, '')
    return Number(value).toFixed(2)
  }

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

<style lang="scss">
.money {
  &--inline {
    display: inline-block;
  }
}
</style>
