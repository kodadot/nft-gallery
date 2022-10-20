<template>
  <BasicBalanceInput
    ref="magicBalanceInput"
    v-model="vValue"
    :decimals="decimals"
    :unit="unit"
    expanded />
</template>

<script lang="ts">
import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'
import AssetMixin from '@/utils/mixins/assetMixin'
import { Component, Prop, VModel, mixins } from 'nuxt-property-decorator'

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
  // @Prop({ type: Number, default: '0' }) min!: number
  // @Prop({ type: Number, default: undefined }) max!: number

  get asset() {
    return this.assetIdOf(this.tokenId)
  }

  get unit() {
    return this.asset.symbol
  }

  get decimals() {
    return this.asset.decimals
  }

  public checkValidity() {
    const balanceInputComponent = this.$refs
      .magicBalanceInput as BasicBalanceInput
    return balanceInputComponent.checkValidity()
  }
}
</script>
