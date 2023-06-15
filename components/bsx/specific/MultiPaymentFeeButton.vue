<template>
  <nuxt-link :to="url">
    {{ $t('general.tx.feesPaidIn', [unit]) }}
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import AssetMixin from '@/utils/mixins/assetMixin'

@Component({})
export default class MultiPaymentFeeButton extends mixins(
  AssetMixin,
  UseApiMixin
) {
  @Prop({ type: String, required: false }) public accountId!: string
  @Prop({ type: String, default: 'bsx', required: false })
  public prefix!: string

  get asset() {
    return this.assetIdOf(this.tokenId)
  }

  get unit() {
    return this.asset.symbol
  }

  get url(): string {
    return `/${this.prefix}/assets`
  }
}
</script>
