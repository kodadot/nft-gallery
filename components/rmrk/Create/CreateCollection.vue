<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm
      v-bind.sync="base"
      ref="collectionForm"
      protective-margin>
      <template #header>
        <NeoField>
          <div>
            {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
          </div>
        </NeoField>
      </template>
      <template #main>
        <BasicSwitch v-model="unlimited" label="mint.unlimited" />
        <NeoField
          v-if="!unlimited"
          class="mt-1"
          :label="$t('Maximum NFTs in collection')">
          <b-numberinput
            v-model="max"
            placeholder="1 is minumum"
            :min="1"></b-numberinput>
        </NeoField>
        <BasicInput
          ref="symbolInput"
          v-model="symbol"
          :label="$t('mint.collection.symbol.label')"
          :message="$t('mint.collection.symbol.message')"
          :placeholder="$t('mint.collection.symbol.placeholder')"
          class="mb-5"
          maxlength="10"
          required
          expanded
          @keydown.native.space.prevent />
      </template>

      <template #footer>
        <NeoField
          v-if="isLogIn"
          type="is-danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="create collection"
            :loading="isLoading"
            @click="submit" />
        </NeoField>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { generateId } from '@/components/rmrk/service/Consolidator'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Interaction } from '@kodadot1/minimark/v1'
import { Component, Ref, mixins } from 'nuxt-property-decorator'
import { BaseCollectionType } from '@/composables/transaction/types'
import { NeoField } from '@kodadot1/brick'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BaseCollectionForm: () => import('@/components/base/BaseCollectionForm.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  NeoField,
}

@Component({ components })
export default class CreateCollection extends mixins(
  MetaTransactionMixin,
  AuthMixin,
  UseApiMixin
) {
  public base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  public symbol = ''
  public max = 1
  public unlimited = true
  protected hasSupport = true
  protected balanceNotEnough = false
  @Ref('collectionForm') readonly collectionForm
  @Ref('symbolInput') readonly symbolInput

  public checkValidity() {
    return (
      this.collectionForm.checkValidity() && this.symbolInput.checkValidity()
    )
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.symbol)
  }

  get balanceNotEnoughMessage() {
    return this.balanceNotEnough ? this.$t('tooltip.notEnoughBalance') : ''
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get isMintDisabled(): boolean {
    return Number(this.balance) <= 2
  }

  public async submit() {
    if (!this.checkValidity()) {
      return
    }

    if (this.isMintDisabled) {
      this.balanceNotEnough = true
      return
    }

    this.isLoading = true
    this.status = 'loader.ipfs'

    const { transaction, status, isLoading, blockNumber } = useTransaction()

    watch([isLoading, status], () => {
      this.isLoading = isLoading.value
      if (Boolean(status.value)) {
        this.status = status.value
      }
    })
    watch(blockNumber, (block) => {
      if (block) {
        this.$emit('created')
      }
    })
    showNotification(
      this.$t('mint.creatingCollection', { name: this.base.name }),
      notificationTypes.info
    )

    try {
      transaction({
        interaction: Interaction.MINT,
        urlPrefix: usePrefix().urlPrefix.value,
        collection: {
          ...this.base,
          nftCount: this.unlimited ? 0 : this.max,
          symbol: this.symbol,
        },
      })
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.warn)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
