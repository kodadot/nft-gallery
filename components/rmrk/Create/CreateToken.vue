<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm v-bind.sync="base" :collections="collections">
      <template v-slot:main>
        <AttributeTagInput
          v-model="tags"
          key="tags"
          placeholder="Get discovered easier through tags" />
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BalanceInput
          label="Price"
          expanded
          key="price"
          :step="0.1"
          @input="updatePrice"
          class="mb-3" />
        <b-message
          v-if="hasPrice"
          key="message"
          type="is-primary"
          has-icon
          icon="exclamation-triangle">
          {{ $t('warning.newTransactionWhilePriceSet') }}
        </b-message>
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
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import collectionForMint from '@/queries/subsquid/rmrk/collectionForMint.graphql'

import {
  DETAIL_TIMEOUT,
  IPFS_KODADOT_IMAGE_PLACEHOLDER,
} from '@/utils/constants'
import { uploadDirect } from '@/utils/directUpload'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/nftStorage'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { canSupport } from '@/utils/support'
import {
  asSystemRemark,
  Attribute,
  CreatedNFT,
  createInteraction,
  createMetadata,
  createMintInteaction,
  createMultipleNFT,
  Interaction,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'
import { formatBalance } from '@polkadot/util'
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { unwrapSafe } from '~/utils/uniquery'
import { basicUpdateFunction } from '../service/NftUtils'
import { toNFTId } from '../service/scheme'
import { preheatFileFromIPFS } from '../utils'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from './mintUtils'

type MintedCollection = BaseMintedCollection & {
  name: string
  max: number
  symbol: string
}

const components = {
  AttributeTagInput: () =>
    import('@/components/rmrk/Create/AttributeTagInput.vue'),
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
  RmrkVersionMixin,
  MetaTransactionMixin,
  ChainMixin,
  PrefixMixin,
  AuthMixin,
  UseApiMixin
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
  protected tags: Attribute[] = []
  protected price: string | number = 0
  protected nsfw = false
  protected postfix = true

  protected updatePrice(value: string) {
    this.price = value
  }

  get hasPrice() {
    return Number(this.price)
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.fetchCollections()
    }
  }

  public async fetchCollections() {
    const collections = await this.$apollo.query({
      query: collectionForMint,
      client: this.client,
      variables: {
        account: this.accountId,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = collections

    this.collections = unwrapSafe(collectionEntities)
      ?.map((ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.length,
        lastIndexUsed: Number(ce.nfts?.at(0)?.index || 0),
        totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
      }))
      .filter(
        (ce: MintedCollection) => (ce.max || Infinity) - ce.alreadyMinted > 0
      )
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

  protected async submit() {
    if (!this.base.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { name, edition, selectedCollection } = this.base
    const { alreadyMinted, id: collectionId } = selectedCollection

    try {
      const api = await this.useApi()
      const metadata = await this.constructMeta()

      const mint = createMultipleNFT(
        edition,
        this.accountId,
        collectionId,
        name,
        metadata,
        alreadyMinted,
        this.postfix && edition > 1 ? basicUpdateFunction : undefined
      )

      const mintInteraction = mint.map((nft) =>
        createMintInteaction(Interaction.MINTNFT, this.version, nft)
      )

      const enabledFees: boolean = this.hasSupport || this.hasCarbonOffset
      const feeMultiplier =
        Number(this.hasSupport) + 2 * Number(this.hasCarbonOffset)
      const isSingle = mintInteraction.length === 1 && !enabledFees

      const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll
      const args = isSingle
        ? mintInteraction[0]
        : [
            ...mintInteraction.map((nft) => asSystemRemark(api, nft)),
            ...(await canSupport(api, enabledFees, feeMultiplier)),
          ]

      await this.howAboutToExecute(
        this.accountId,
        cb,
        [args],
        (blockNumber) => {
          showNotification(
            `[NFT] Saved ${this.base.name} in block ${blockNumber}`,
            notificationTypes.success
          )

          if (this.hasPrice) {
            const list = this.listForSale
            setTimeout(() => list(mint, blockNumber), 300)
          }
        }
      )
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
      ...(this.tags || []),
      ...nsfwAttribute(this.nsfw),
      ...offsetAttribute(this.hasCarbonOffset),
    ].filter((item) => item.trait_type || item.display_type)

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
    preheatFileFromIPFS(fileHash)
    uploadDirect(file, metaHash).catch(this.$consola.warn)
    return unSanitizeIpfsUrl(metaHash)
  }

  public async listForSale(remarks: CreatedNFT[], originalBlockNumber: string) {
    try {
      const api = await this.useApi()

      const { version, price } = this
      const balance = formatBalance(price, {
        decimals: this.decimals,
        withUnit: this.unit,
      })
      showNotification(`[💰] Listing NFT to sale for ${balance}`)

      const onlyNfts = remarks
        .map((nft) => toNFTId(nft, originalBlockNumber))
        .map((id) =>
          createInteraction(Interaction.LIST, version, id, String(price))
        )

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.danger)
        return
      }

      const cb = api.tx.utility.batchAll
      const args = onlyNfts.map((rmrk) => asSystemRemark(api, rmrk))

      this.isLoading = true
      await this.howAboutToExecute(
        this.accountId,
        cb,
        [args],
        (blockNumber) => {
          showNotification(
            `[💰] Listed ${this.base.name} for ${balance} in block ${blockNumber}`,
            notificationTypes.success
          )
          this.navigateToDetail(remarks[0], originalBlockNumber)
        }
      )
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger)
    }
  }

  protected async estimateTx() {
    // TODO: implement
  }

  protected navigateToDetail(nft: CreatedNFT, blockNumber: string) {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const go = () =>
      this.$router.push({
        path: `/rmrk/detail/${toNFTId(nft, blockNumber)}`,
        query: { message: 'congrats' },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }
}
</script>
