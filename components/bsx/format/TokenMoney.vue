<template>
  <BasicMoney
    :value="value"
    :unit="unit"
    :decimals="decimals"
    :inline="inline"
    :hideUnit="hideUnit" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import BasicMoney from '@/components/shared/format/BasicMoney.vue'
import { useApollo } from '~/utils/config/useApollo'
import { AssetItem } from '../Asset/types'
import assetById from '@/queries/subsquid/bsx/assetById.graphql'

@Component({
  components: {
    BasicMoney,
  },
})
export default class TokenMoney extends Vue {
  @Prop({ default: '0' }) readonly value: number | string | undefined
  @Prop({ type: String, default: '5' }) tokenId!: string | number
  @Prop({ type: String, default: 'bsx' }) prefix!: string

  protected unit = 'BSX'
  protected decimals = 12

  // TODO: rework into the store
  async fetch() {
    const { asset } = await useApollo<this, { asset: AssetItem }>(
      this.$apollo,
      this.prefix,
      assetById,
      { id: this.tokenId }
    )
    if (asset) {
      this.unit = asset.symbol
      this.decimals = asset.decimals
    }
  }

  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean
}
</script>
