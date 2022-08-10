<template>
  <BasicBalanceInput
    ref="magicBalanceInput"
    v-model="vValue"
    :decimals="decimals"
    :unit="unit"
    expanded />
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'nuxt-property-decorator'
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'
import { useApollo } from '~/utils/config/useApollo'
import assetById from '@/queries/subsquid/bsx/assetById.graphql'
import { AssetItem } from '../Asset/types'

@Component({
  components: {
    BasicBalanceInput,
  },
})
export default class TokenBalanceInput extends Vue {
  @VModel() vValue!: string | number
  @Prop({ type: String, required: false, default: '5' }) tokenId!:
    | string
    | number
  @Prop({ type: String, required: false, default: 'bsx' }) prefix!: string

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

  public checkValidity() {
    const balanceInputComponent = this.$refs
      .magicBalanceInput as BasicBalanceInput
    return balanceInputComponent.checkValidity()
  }
}
</script>
