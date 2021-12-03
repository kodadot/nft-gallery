<template>
  <ModalWrapper icon="trash" :title="title" isRight>
    <template v-slot:default>
      <Loader v-model="isLoading" :status="status" />
      <div class="buttons">
        <b-button type="is-danger" expanded outlined @click="clearMeta"
          >Remove metadata</b-button
        >
        <b-button
          type="is-danger"
          expanded
          outlined
          @click="clearAttrs"
          :disabled="!hasAttributes"
          >Remove ALL attributes</b-button
        >
      </div>
    </template>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, mixins, Prop, Vue } from 'nuxt-property-decorator'
import Connector from '@vue-polkadot/vue-api'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { showNotification } from '~/utils/notification'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  ModalWrapper: () => import('@/components/shared/modals/ModalWrapper.vue'),
}

@Component({
  name: 'DangerModal',
  components,
})
export default class DangerModal extends mixins(MetaTransactionMixin) {
  @Prop({ type: String, required: true }) public accountId!: string
  @Prop({ type: String }) public title!: string
  @Prop({ type: String, required: true }) public collectionId!: string
  @Prop(String) public nftId!: string
  @Prop(Array) public attributes!: string[]

  protected clearMeta() {
    this.submit(true)
  }

  protected clearAttrs() {
    this.submit(false)
  }

  get hasAttributes() {
    return this.attributes && this.attributes.length > 0
  }

  protected async submit(isMeta: boolean) {
    const { api } = Connector.getInstance()
    this.initTransactionLoader()
    const cb = isMeta
      ? api.tx.uniques.clearMetadata
      : api.tx.uniques.clearAttributes
    const args = isMeta
      ? [this.collectionId, this.nftId]
      : [this.collectionId, this.nftId, this.attributes]
    this.howAboutToExecute(this.accountId, cb, args, this.onSuccess)

    this.$emit('close')
  }

  protected onSuccess(block: string) {
    showNotification(`Meta cleared in block ${block}`)
  }
}
</script>
