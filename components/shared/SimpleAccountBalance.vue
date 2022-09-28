<template>
  <TokenMoney
    v-if="tokenId"
    :value="realBalance"
    :token-id="tokenId"
    :inline="inline" />
  <Money v-else :value="realBalance" :inline="inline" />
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  TokenMoney: () => import('@/components/bsx/format/TokenMoney.vue'),
}

@Component({ components })
export default class AccountBalance extends mixins(AuthMixin) {
  @Prop({ type: String, default: '' }) readonly tokenId!: string
  @Prop(Boolean) readonly inline!: boolean

  get realBalance(): string {
    return !this.tokenId ? this.balance : this.balanceOf(this.tokenId)
  }

  get balanceOf(): (id: string | number) => string {
    return this.$store.getters.getTokenBalanceOf
  }
}
</script>
