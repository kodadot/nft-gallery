<template>
  <p class="subtitle is-size-6" v-if="accountId">
    <span>{{ $t('general.balance') }}: </span>
    <TokenMoney v-if="tokenId" :value="balance" :tokenId="tokenId" inline />
    <Money v-else :value="balance" inline />
  </p>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  TokenMoney: () => import('@/components/bsx/format/TokenMoney.vue'),
}

@Component({ components })
export default class AccountBalance extends mixins(AuthMixin) {
  @Prop({ type: String, default: '' }) readonly tokenId!: string

  get realBalance(): string {
    return !this.tokenId ? this.balance : '0'
  }
}
</script>
