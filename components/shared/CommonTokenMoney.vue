<template>
  <TokenMoney
    v-if="tokenId"
    :value="value"
    :token-id="tokenId"
    :prefix="urlPrefix"
    :data-cy="dataCy"
    :round="round"
    inline />
  <Money v-else :value="value" :data-cy="dataCy" inline :round="round" />
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'

const components = {
  Money: () => import('@/components/shared/format/Money.vue'),
  TokenMoney: () => import('@/components/bsx/format/TokenMoney.vue'),
}

@Component({ components })
export default class CommonTokenMoney extends mixins(PrefixMixin) {
  @Prop({ default: '0' }) readonly value!: number | string | undefined
  @Prop({ default: '' }) readonly customTokenId!: string | undefined
  @Prop({ type: String, default: '' }) readonly dataCy!: string
  @Prop({ type: Number, default: 4 }) readonly round!: number

  get currentTokenId() {
    return this.customTokenId || this.tokenId
  }
}
</script>
