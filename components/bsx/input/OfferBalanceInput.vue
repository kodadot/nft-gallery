<template>
  <BasicBalanceInput
    ref="magicBalanceInput"
    v-model="vValue"
    :decimals="decimals"
    :min="min"
    :unit="unit"
    expanded />
</template>

<script lang="ts">
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'
import assetById from '@/queries/subsquid/bsx/assetById.graphql'
import { onApiConnect } from '@kodadot1/sub-api'
import { Component, Prop, VModel, mixins } from 'nuxt-property-decorator'
import { useApollo } from '@/utils/config/useApollo'
import { formatBsxBalanceToNumber } from '@/utils/format/balance'
import ApiUrlMixin from '@/utils/mixins/apiUrlMixin'
import { AssetItem } from '../Asset/types'

@Component({
  components: {
    BasicBalanceInput,
  },
})
export default class OfferBalanceInput extends mixins(ApiUrlMixin) {
  @VModel() vValue!: string | number
  @Prop({ type: String, required: false, default: '5' }) tokenId!:
    | string
    | number
  @Prop({ type: String, default: 'bsx' }) prefix!: string
  @Prop({ type: Number, default: undefined }) max!: number

  protected unit = 'BSX'
  protected decimals = 12
  protected min = 0

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

  created() {
    onApiConnect(this.apiUrl, (api) => {
      this.min = formatBsxBalanceToNumber(
        api?.consts?.marketplace?.minimumOfferAmount?.toString()
      )
    })
  }

  public checkValidity() {
    const balanceInputComponent = this.$refs
      .magicBalanceInput as BasicBalanceInput
    return balanceInputComponent.checkValidity()
  }
}
</script>
