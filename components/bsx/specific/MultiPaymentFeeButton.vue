<template>
  <nuxt-link :to="url">
    {{ $t('general.tx.feesPaidIn', [unit]) }}
  </nuxt-link>
</template>

<script lang="ts">
import { getAssetIdByAccount } from '@/utils/api/bsx/query'
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
  protected tokenId = '0'

  mounted() {
    this.fetchCurrency()
  }

  get asset() {
    return this.assetIdOf(this.tokenId)
  }

  get unit() {
    return this.asset.symbol
  }

  get url(): string {
    return `/${this.prefix}/assets`
  }

  async fetchCurrency() {
    try {
      const api = await this.useApi()
      this.tokenId = await getAssetIdByAccount(api, this.accountId)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
