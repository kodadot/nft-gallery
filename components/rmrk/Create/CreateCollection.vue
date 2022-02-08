<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm v-bind.sync="base" protectiveMargin>
      <template v-slot:header>
        <b-field>
          <div>
            {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
          </div>
        </b-field>
      </template>
      <template v-slot:main>
        <BasicSwitch v-model="unlimited" label="mint.unlimited" />
        <b-field
          v-if="!unlimited"
          class="mt-1"
          :label="$i18n.t('Maximum NFTs in collection')">
          <b-numberinput
            v-model="max"
            placeholder="1 is minumum"
            :min="1"></b-numberinput>
        </b-field>
        <BasicInput
          v-if="!autoGenerateSymbol"
          v-model="symbol"
          :label="$t('mint.collection.symbol.label')"
          :message="$t('mint.collection.symbol.message')"
          :placeholder="$t('mint.collection.symbol.placeholder')"
          class="mb-5"
          @keydown.native.space.prevent
          maxlength="10"
          expanded />
      </template>

      <template v-slot:footer>
        <SubmitButton
          label="create collection"
          :disabled="disabled"
          :loading="isLoading"
          @click="submit" />
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '@/utils/notification'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { unSanitizeIpfsUrl } from '@/utils/ipfs'
import { generateId } from '@/components/rmrk/service/Consolidator'
import { canSupport } from '@/utils/support'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/pinning'
import { uploadDirect } from '@/utils/directUpload'
import AuthMixin from '@/utils/mixins/authMixin'
import {
  createMetadata,
  createCollection,
  CreatedCollection,
  createMintInteaction,
  Interaction,
  asSystemRemark,
  addressToHex,
} from '@kodadot1/minimark'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import collectionSymbolsByAccount from '@/queries/collectionSymbolsByAccount.graphql'

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
  AuthMixin
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

  get rmrkId(): string {
    return generateId(this.accountId, this.symbol)
  }

  get accountIdToPubKey(): string {
    return addressToHex(this.accountId)
  }

  get autoGenerateSymbol(): boolean {
    return this.$store.state.preferences.autoGenerateSymbol
  }

  get disabled(): boolean {
    const {
      base: { name },
      symbol,
      max,
      accountId,
      unlimited,
      autoGenerateSymbol,
    } = this
    return !(
      name &&
      (symbol || autoGenerateSymbol) &&
      (unlimited || max) &&
      accountId
    )
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
      uploadDirect(file, metaHash).catch(console.warn)
    }

    return unSanitizeIpfsUrl(metaHash)
  }

  protected async submit() {
    this.isLoading = true
    this.status = 'loader.ipfs'

    try {
      const metadata = await this.constructMeta()
      const mint = this.constructRmrkMint(metadata)
      console.log(mint)
      const mintInteraction = createMintInteaction(
        Interaction.MINT,
        this.version,
        mint
      )

      const { api } = Connector.getInstance()
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
            ...(await canSupport(this.hasSupport)),
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
        }
      )
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e)
      this.isLoading = false
    }
  }
}
</script>
