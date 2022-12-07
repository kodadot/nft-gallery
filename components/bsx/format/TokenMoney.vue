<template>
  <BasicMoney
    :value="value"
    :unit="unit"
    :decimals="decimals"
    :inline="inline"
    :hide-unit="hideUnit"
    :round="round" />
</template>

<script lang="ts">
import BasicMoney from '@/components/shared/format/BasicMoney.vue'
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import AssetMixin from '@/utils/mixins/assetMixin'

@Component({
  components: {
    BasicMoney,
  },
})
export default class TokenMoney extends mixins(AssetMixin) {
  @Prop({ default: '0' }) readonly value: number | string | undefined
  @Prop({ type: String, default: '5' }) tokenId!: string | number

  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean
  @Prop({ type: Number, default: 4 }) readonly round!: number

  get asset() {
    return this.assetIdOf(this.tokenId)
  }

  get unit() {
    return this.asset.symbol
  }

  get decimals() {
    return this.asset.decimals
  }
}
</script>
