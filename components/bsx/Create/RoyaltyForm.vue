<template>
  <div>
    <BasicNumberInput
      v-model="vRoyalty"
      :label="$t('mint.royalty.rate')"
      expanded
      :step="0.1"
      :min-step="0.01"
      :min="0.01"
      :max="99.99" />

    <BasicSwitch v-model="isMine" label="mint.royalty.mine" />
    <AddressInput
      v-show="!isMine"
      v-model="destinationAddress"
      label="mint.royalty.receiver"
      :strict="false"
      empty-on-error
      @input="handleAddressUpdate" />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  PropSync,
  Watch,
  mixins,
} from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'

const components = {
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue'),
  BasicNumberInput: () =>
    import('@/components/shared/form/BasicNumberInput.vue'),
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
