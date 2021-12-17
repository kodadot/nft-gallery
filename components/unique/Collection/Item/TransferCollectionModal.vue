<template>
  <ModalWrapper icon="paper-plane" title="Transfer collection" isRight>
    <template v-slot:default>
      <Loader v-model="isLoading" :status="status" />
      <b-field>
        <Auth />
      </b-field>
      <b-field>
        <AddressInput v-model="destinationAddress" :strict="false" />
      </b-field>
      <b-field>

        <b-button
          type="is-primary"
          icon-left="paper-plane"
          class="mt-2"
          :loading="isLoading"
          :disabled="disabled"
          outlined
          @click="submit"
        >
          {{ $t('general.submit') }}
        </b-button>
      </b-field>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import Connector from '@vue-polkadot/vue-api'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { showNotification } from '~/utils/notification'
import { isAddress } from '@polkadot/util-crypto'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  ModalWrapper: () => import('@/components/shared/modals/ModalWrapper.vue'),
}

@Component({
  name: 'TransferCollectionModal',
  components,
})
export default class TransferCollectionModal extends mixins(
  MetaTransactionMixin
) {
  @Prop({ type: String, required: true }) public accountId!: string
  @Prop({ type: String, required: true }) public collectionId!: string
  @Prop(String) public currentOwnerId!: string
  protected destinationAddress = ''


  get disabled(): boolean {
    return !this.hasAddress || !this.accountId
  }

  get hasAddress(): boolean {
    return isAddress(this.destinationAddress)
  }

  protected async submit(isMeta: boolean) {
    const { api } = Connector.getInstance()
    this.initTransactionLoader()
    const cb = api.tx.uniques.transferOwnership
    const args = [this.collectionId, this.destinationAddress]
    this.howAboutToExecute(this.accountId, cb, args, this.onSuccess)

    this.$emit('close')
  }

  protected onSuccess(block: string) {
    showNotification(`Collection transfered in block ${block}`)
  }
}
</script>
