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
import { useIdentityStore } from '@/stores/identity'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  TokenMoney: () => import('@/components/bsx/format/TokenMoney.vue'),
}

@Component({ components })
export default class AccountBalance extends mixins(AuthMixin) {
  @Prop({ type: String, default: '' }) readonly tokenId!: string
  @Prop(Boolean) readonly inline!: boolean

  get identityStore() {
    return useIdentityStore()
  }

  get realBalance(): string {
    return !this.tokenId ? this.balance : this.balanceOf(this.tokenId)
  }

  balanceOf(id: string) {
    return this.identityStore.getTokenBalanceOf(id)
  }
}
</script>
