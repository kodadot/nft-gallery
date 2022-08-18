<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm
      v-bind.sync="base"
      ref="collectionForm"
      protective-margin>
      <template #header>
        <b-field>
          <div>
            {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
          </div>
        </b-field>
      </template>
      <template #main>
        <BasicSwitch v-model="unlimited" label="mint.unlimited" />
        <b-field
          v-if="!unlimited"
          class="mt-1"
          :label="$t('Maximum NFTs in collection')">
          <b-numberinput
            v-model="max"
            placeholder="1 is minumum"
            :min="1"></b-numberinput>
        </b-field>
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
        <b-field
          v-if="isLogIn"
          type="is-danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            label="create collection"
            :loading="isLoading"
            @click="submit" />
        </b-field>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { generateId } from '@/components/rmrk/service/Consolidator'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import { uploadDirect } from '@/utils/directUpload'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { PinningKey, pinFileToIPFS, pinJson } from '@/services/nftStorage'
import { notificationTypes, showNotification } from '@/utils/notification'
import { canSupport } from '@/utils/support'
import {
  CreatedCollection,
  Interaction,
  addressToHex,
  asSystemRemark,
  createCollection,
  createMetadata,
  createMintInteaction,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'
import { Component, Ref, mixins } from 'nuxt-property-decorator'

type BaseCollectionType = {
  name: string
  file: File | null
  description: string
}

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BaseCollectionForm: () => import('@/components/base/BaseCollectionForm.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
}

@Component({ components })
export default class CreateCollection extends mixins(
  RmrkVersionMixin,
  MetaTransactionMixin,
  AuthMixin,
  UseApiMixin
) {
  private base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  private symbol = ''
  private max = 1
  protected unlimited = true
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

  get accountIdToPubKey(): string {
    return addressToHex(this.accountId)
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get isMintDisabled(): boolean {
    return Number(this.balance) <= 2
  }

  public constructRmrkMint(metadata: string): CreatedCollection {
    const {
      symbol,
      base: { name },
      max,
    } = this
    const count = this.unlimited ? 0 : max
    return createCollection(this.accountId, symbol, name, metadata, count)
  }

  public async constructMeta() {
    const { file, name, description } = this.base

    const pinningKey: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const imageHash = !file
      ? IPFS_KODADOT_IMAGE_PLACEHOLDER
      : await pinFileToIPFS(file, pinningKey.token)
    const type = !file ? 'image/png' : file.type
    const meta = createMetadata(
      name,
      description,
      imageHash,
      undefined,
      [],
      undefined,
      type
    )
    const metaHash = await pinJson(meta, imageHash)

    if (file) {
      uploadDirect(file, metaHash).catch(this.$consola.warn)
    }

    return unSanitizeIpfsUrl(metaHash)
  }

  protected async submit() {
    if (!this.checkValidity()) {
      return
    }

    if (this.isMintDisabled) {
      this.balanceNotEnough = true
      return
    }

    this.isLoading = true
    this.status = 'loader.ipfs'

    try {
      const metadata = await this.constructMeta()
      const mint = this.constructRmrkMint(metadata)
      const mintInteraction = createMintInteaction(
        Interaction.MINT,
        this.version,
        mint
      )

      const api = await this.useApi()
      showNotification(
        `Creating collection ${this.base.name}`,
        notificationTypes.info
      )

      const cb = !this.hasSupport
        ? api.tx.system.remark
        : api.tx.utility.batchAll
      const args = !this.hasSupport
        ? mintInteraction
        : [
            asSystemRemark(api, mintInteraction),
            ...(await canSupport(api, this.hasSupport)),
          ]

      await this.howAboutToExecute(
        this.accountId,
        cb,
        [args],
        (blockNumber) => {
          showNotification(
            `[Collection] Saved ${this.base.name} in block ${blockNumber}`,
            notificationTypes.success
          )
          this.$emit('created')
        }
      )
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
