<template>
  <BasicBalanceInput
    ref="magicBalanceInput"
    v-model="vValue"
    :decimals="decimals"
    :unit="unit"
    expanded />
</template>

<script lang="ts">
import { Component, mixins, Prop, VModel } from 'nuxt-property-decorator'
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'
import { useApollo } from '~/utils/config/useApollo'
import assetById from '@/queries/subsquid/bsx/assetById.graphql'
import { AssetItem } from '../Asset/types'
import AssetMixin from '@/utils/mixins/assetMixin'

@Component({
  components: {
    BasicBalanceInput,
  },
})
export default class TokenBalanceInput extends mixins(AssetMixin) {
  @VModel() vValue!: string | number
  @Prop({ type: String, required: false, default: '5' }) tokenId!:
    | string
    | number
  @Prop({ type: String, default: 'bsx' }) prefix!: string
  // @Prop({ type: Number, default: '0' }) min!: number
  // @Prop({ type: Number, default: undefined }) max!: number

  protected unit = 'BSX'
  protected decimals = 12

  // get asset() {
  //   return this.assetIdOf(this.tokenId)
  // }

  // get unit() {
  //   return this.asset.symbol
  // }

  // get decimals() {
  //   return this.asset.decimals
  // }

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

  public checkValidity() {
    const balanceInputComponent = this.$refs
      .magicBalanceInput as BasicBalanceInput
    return balanceInputComponent.checkValidity()
  }
}
</script>
