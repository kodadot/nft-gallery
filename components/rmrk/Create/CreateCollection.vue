<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm v-bind.sync="base">
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
          v-model="symbol"
          :label="$t('mint.collection.symbol.label')"
          :message="$t('mint.collection.symbol.message')"
          :placeholder="$t('mint.collection.symbol.placeholder')"
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
import Connector from '@vue-polkadot/vue-api'
import { notificationTypes, showNotification } from '@/utils/notification'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { unSanitizeIpfsUrl } from '@/utils/ipfs'
import { decodeAddress } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { generateId } from '@/components/rmrk/service/Consolidator'
import { supportTx, calculateCost } from '@/utils/support'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/pinning'
import AuthMixin from '~/utils/mixins/authMixin'
import {
  createMetadata,
  createCollection,
  CreatedCollection,
  createMintInteaction,
  Interaction,
  asSystemRemark,
  addressToHex,
} from '@vue-polkadot/minimark'

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

  get disabled(): boolean {
    const {
      base: { name },
      symbol,
      max,
      accountId,
      unlimited,
    } = this
    return !(name && symbol && (unlimited || max) && accountId)
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

  get filePrice() {
    return calculateCost(this.base.file)
  }

  public async constructMeta() {
    const { file, name, description } = this.base
    if (!file) {
      throw new ReferenceError('No file found!')
    }

    const pinningKey: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const imageHash = await pinFileToIPFS(file, pinningKey.token)
    const meta = createMetadata(
      name,
      description,
      imageHash,
      undefined,
      [],
      undefined,
      file.type
    )
    const metaHash = await pinJson(meta, imageHash)

    return unSanitizeIpfsUrl(metaHash)
  }

  protected async canSupport() {
    if (this.hasSupport && this.base.file) {
      return [await supportTx(this.base.file)]
    }

    return []
  }

  protected async submit() {
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
        : [asSystemRemark(api, mintInteraction), ...(await this.canSupport())]

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
