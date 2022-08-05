<template>
  <nuxt-link :to="url">
    {{ $t('general.tx.feesPaidIn', [symbol]) }}
  </nuxt-link>
</template>

<script lang="ts">
import { getAssetMetadataByAccount } from '@/utils/api/bsx/query'
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import UseApiMixin from '@/utils/mixins/useApiMixin'

@Component({})
export default class MultiPaymentFeeButton extends mixins(UseApiMixin) {
  @Prop({ type: String, required: false }) public accountId!: string
  @Prop({ type: String, default: 'bsx', required: false })
  public prefix!: string
  protected symbol = 'XXX'

  mounted() {
    this.fetchCurrency()
  }

  get url(): string {
    return `/${this.prefix}/assets`
  }

  async fetchCurrency() {
    try {
      console.log('kokoooooot')
      const api = await this.useApi()
      const { symbol } = await getAssetMetadataByAccount(api, this.accountId)
      this.symbol = symbol
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
