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
import { Component, mixins, Prop, Vue, Watch } from 'nuxt-property-decorator'
import Connector from '@kodadot1/sub-api'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { showNotification } from '~/utils/notification'
import { Attribute } from '../../types'
import { emptyArray } from '@/utils/empty'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  ModalWrapper: () => import('@/components/shared/modals/ModalWrapper.vue'),
}

@Component({
  name: 'DangerModal',
  components,
})
export default class DangerModal extends mixins(MetaTransactionMixin) {
  @Prop({ type: String }) public accountId!: string
  @Prop({ type: String }) public title!: string
  @Prop({ type: String, required: true }) public collectionId!: string
  @Prop(String) public nftId!: string
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public attributes!: Attribute[]

  protected clearMeta() {
    this.submit(true)
  }

  protected clearAttrs() {
    this.submit(false)
  }

  get hasAttributes() {
    return this.attributes && this.attributes.length
  }

  protected async submit(isMeta: boolean) {
    const { api } = Connector.getInstance()
    this.initTransactionLoader()
    const cb = isMeta ? api.tx.uniques.clearMetadata : api.tx.utility.batchAll
    const args = isMeta
      ? [this.collectionId, this.nftId]
      : [
          this.attributes
            .map((attr) => attr.key)
            .map((key) =>
              api.tx.uniques.clearAttribute(this.collectionId, this.nftId, key)
            ),
        ]

    this.howAboutToExecute(this.accountId, cb, args, this.onSuccess)

    this.$emit('close')
  }

  protected onSuccess(block: string) {
    showNotification(`Meta cleared in block ${block}`)
  }

  @Watch('attributes', { deep: true })
  protected onAttributesChange(val: Attribute[], oldVal: Attribute[]) {
    if (val.length !== oldVal.length) {
      console.log('attributes changed', val)
    }
  }
}
</script>
