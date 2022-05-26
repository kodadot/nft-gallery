<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm
      v-bind.sync="base"
      :collections="collections"
      :hasEdition="false">
      <template v-slot:main>
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BalanceInput
          label="Price"
          expanded
          key="price"
          @input="updatePrice"
          class="mb-3" />
        <CustomAttributeInput
          key="attributes"
          v-show="base.selectedCollection"
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" />
      </template>
      <template v-slot:footer>
        <b-field key="advanced">
          <CollapseWrapper
            v-if="base.edition > 1"
            visible="mint.expert.show"
            hidden="mint.expert.hide"
            class="mt-3">
            <BasicSwitch
              class="mt-3"
              v-model="postfix"
              label="mint.expert.postfix" />
          </CollapseWrapper>
        </b-field>
        <b-field key="deposit">
          <p class="has-text-weight-medium is-size-6 has-text-warning">
            {{ $t('mint.deposit') }}: <Money :value="deposit" inline />
          </p>
        </b-field>
        <SubmitButton
          key="submit"
          label="mint.submit"
          :disabled="disabled"
          :loading="isLoading"
          @click="submit" />
      </template>
    </BaseTokenForm>
  </div>
</template>

<script lang="ts">
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/components/rmrk/Create/mintUtils'
import ChainMixin from '@/utils/mixins/chainMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/pinning'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  Attribute,
  createMetadata,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'
import Connector from '@kodadot1/sub-api'
import { Component, mixins, Watch } from 'nuxt-property-decorator'

import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import {
  getInstanceDeposit,
  getMetadataDeposit,
} from '@/components/unique/apiConstants'
import { createTokenId } from '@/components/unique/utils'
import onApiConnect from '@/utils/api/general'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'

type MintedCollection = BaseMintedCollection & {
  name?: string
  lastIndexUsed: number
}

const components = {
  CustomAttributeInput: () =>
    import('@/components/rmrk/Create/CustomAttributeInput.vue'),
  CollapseWrapper: () =>
    import('@/components/shared/collapse/CollapseWrapper.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  BaseTokenForm: () => import('@/components/base/BaseTokenForm.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
}

@Component({ components })
export default class CreateToken extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  PrefixMixin,
  AuthMixin
) {
  protected base: BaseTokenType<MintedCollection> = {
    name: '',
    file: null,
    description: '',
    selectedCollection: null,
    edition: 1,
    secondFile: null,
  }
  protected collections: MintedCollection[] = []
  protected postfix = true
  protected deposit = '0'
  protected depositPerByte = BigInt(0)
  protected attributes: Attribute[] = []
  protected nsfw = false
  protected price: string | number = 0

  protected updatePrice(value: number) {
    this.price = value
  }

  get hasPrice() {
    return Number(this.price)
  }

  public async created() {
    onApiConnect(() => {
      const instanceDeposit = getInstanceDeposit()
      const metadataDeposit = getMetadataDeposit()
      this.deposit = (instanceDeposit + metadataDeposit).toString()
    })
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.fetchCollections()
    }
  }

  public async fetchCollections() {
    const query = await resolveQueryPath(this.urlPrefix, 'collectionForMint')
    const collections = await this.$apollo.query({
      query: query.default,
      client: this.urlPrefix,
      variables: {
        account: this.accountId,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = collections

    this.collections = unwrapSafe(collectionEntities)?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.length,
      lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
    }))
  }

  get disabled() {
    return !(this.base.name && this.base.file && this.base.selectedCollection)
  }

  get hasSupport(): boolean {
    return this.$store.state.preferences.hasSupport
  }

  get hasCarbonOffset(): boolean {
    return this.$store.state.preferences.hasCarbonOffset
  }

  get arweaveUpload(): boolean {
    return this.$store.state.preferences.arweaveUpload
  }

  protected async submit(): Promise<void> {
    if (!this.base.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { api } = Connector.getInstance()
    const { selectedCollection } = this.base
    const {
      alreadyMinted,
      id: collectionId,
      lastIndexUsed,
    } = selectedCollection

    try {
      const metadata = await this.constructMeta()
      const cb = api.tx.utility.batchAll
      const nextId = Math.max(lastIndexUsed + 1, alreadyMinted)
      const create = api.tx.nft.mint(collectionId, nextId, metadata)
      const list = this.price
        ? [api.tx.marketplace.setPrice(collectionId, nextId, this.price)]
        : []

      // const support = await canSupport(this.hasSupport)
      //
      const args = [[create, ...list]]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[NFT] Saved ${this.base.name} in block ${blockNumber}`,
          notificationTypes.success
        )

        this.navigateToDetail(collectionId, String(nextId))
      })
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.toString(), notificationTypes.danger)
        this.isLoading = false
      }
    }
  }

  public async constructMeta(): Promise<string> {
    const { file, name, description, secondFile } = this.base

    if (!file) {
      throw new ReferenceError('No file found!')
    }

    const { token }: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const fileHash = await pinFileToIPFS(file, token)
    const secondFileHash = secondFile
      ? await pinFileToIPFS(secondFile, token)
      : undefined

    let imageHash: string | undefined = fileHash
    let animationUrl: string | undefined = undefined

    // if secondaryFileVisible(file) then assign secondaryFileHash to image and set animationUrl to fileHash
    if (secondaryFileVisible(file)) {
      animationUrl = fileHash
      imageHash = secondFileHash || IPFS_KODADOT_IMAGE_PLACEHOLDER
    }

    const attributes = [
      ...(this.attributes || []),
      ...nsfwAttribute(this.nsfw),
      ...offsetAttribute(this.hasCarbonOffset),
    ]

    const meta = createMetadata(
      name,
      description,
      imageHash,
      animationUrl,
      attributes,
      'https://kodadot.xyz',
      file.type
    )

    const metaHash = await pinJson(meta, imageHash)
    return unSanitizeIpfsUrl(metaHash)
  }

  protected navigateToDetail(collection: string, id: string): void {
    showNotification('You will go to the detail in 2 seconds')
    const go = () =>
      this.$router.push({
        path: `/${this.urlPrefix}/gallery/${createTokenId(collection, id)}`,
        query: { message: 'congrats' },
      })
    setTimeout(go, 2000)
  }
}
</script>
