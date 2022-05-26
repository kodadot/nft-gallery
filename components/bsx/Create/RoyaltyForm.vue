<template>
  <div>
    <BasicSlider v-model="vRoyalty" label="mint.royalty.amount" />
    <BasicSwitch v-model="isMine" label="mint.royalty.mine" />
    <AddressInput
      v-show="!isMine"
      label="mint.royalty.receiver"
      v-model="destinationAddress"
      :strict="false"
      emptyOnError />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  mixins,
  Prop,
  PropSync,
  Vue,
  Watch,
} from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'

const components = {
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue'),
}

@Component({ components })
export default class RoyaltyForm extends mixins(AuthMixin) {
  @PropSync('amount', { type: Number, required: true }) vRoyalty!: number
  @PropSync('address', { type: String, required: true }) vAddress!: string
  protected isMine = true
  protected destinationAddress = ''

  @Watch('isMine', { immediate: true })
  protected onIsMineChange(value: boolean) {
    this.handleAddressUpdate(value ? this.accountId : this.destinationAddress)
  }

  @Emit('update:address')
  protected handleAddressUpdate(value: string) {
    return value
  }
}
</script>
