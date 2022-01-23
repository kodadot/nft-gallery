<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm v-bind.sync="base" :collections="collections">
      <template v-slot:main>
        <AttributeTagInput
          v-model="tags"
          key="tags"
          placeholder="Get discovered easier through tags" />

        <BasicSwitch v-model="nsfw" label="mint.nfsw" />

        <BalanceInput
          label="Price"
          expanded
          key="price"
          @input="updatePrice"
          class="mb-5" />
        <!-- TODO: add that msg -->
      </template>
      <template v-slot:footer>
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
import collectionForMint from '@/queries/collectionForMint.graphql'
import { extractCid, ipfsToArweave, unSanitizeIpfsUrl } from '@/utils/ipfs'
import ChainMixin from '@/utils/mixins/chainMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import TransactionMixin from '@/utils/mixins/txMixin'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/pinning'
import shouldUpdate from '@/utils/shouldUpdate'
import { canSupport } from '@/utils/support'
import exec, {
  estimate,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import { DispatchError } from '@polkadot/types/interfaces'
import { formatBalance } from '@polkadot/util'
import Connector from '@vue-polkadot/vue-api'
import { notificationTypes, showNotification } from '@/utils/notification'
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import NFTUtils, { basicUpdateFunction } from '../service/NftUtils'
import { getNftId, MintNFT, NFT, NFTMetadata } from '../service/scheme'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from './mintUtils'
import { fil } from 'date-fns/locale'
import { createMetadata, Attribute } from '@vue-polkadot/minimark'
import { Optional } from '../service/types'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '~/utils/constants'

interface NFTAndMeta extends NFT {
  meta: NFTMetadata
}

type MintedCollection = {
  id: string
  name: string
  alreadyMinted: number
  max: number
  metadata: string
  symbol: string
}

type BaseTokenType = {
  name: string
  file: File | null
  description: string
  selectedCollection: MintedCollection | null
  edition: number
  secondFile: File | null
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
  TransactionMixin,
  ChainMixin,
  PrefixMixin
) {
  protected base: BaseTokenType = {
    name: '',
    file: null,
    description: '',
    selectedCollection: null,
    edition: 1,
    secondFile: null,
  }

  protected collections: MintedCollection[] = []
  private selectedCollection: MintedCollection | null = null
  protected tags: Attribute[] = []
  protected price: string | number = 0
  protected nsfw = false

  private password = ''
  private alreadyMinted = 0
  private estimated = ''
  private filePrice = 0
  protected postfix = true

  protected updatePrice(value: number) {
    console.log(typeof value, value)
    this.price = value
  }

  get accountId() {
    return this.$store.getters.getAuthAddress
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
      client: this.urlPrefix,
      variables: {
        account: this.accountId,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = collections

    this.collections = collectionEntities.nodes
      ?.map((ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.totalCount,
      }))
      .filter(
        (ce: MintedCollection) => (ce.max || Infinity) - ce.alreadyMinted > 0
      )
  }

  get disabled() {
    return !(this.base.name && this.base.file && this.selectedCollection)
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

  private toRemark(remark: string) {
    const { api } = Connector.getInstance()
    return api.tx.system.remark(remark)
  }

  protected async submit() {
    if (!this.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { api } = Connector.getInstance()
    const { alreadyMinted, id: collectionId } = this.selectedCollection

    try {
      const metadata = await this.constructMeta()
      // missin possibility to handle more than one remark

      const mint = NFTUtils.createMultipleNFT(
        this.nft.edition,
        this.accountId,
        collectionId,
        this.nft.name,
        metadata,
        alreadyMinted,
        this.postfix && this.nft.edition > 1 ? basicUpdateFunction : undefined
      )
      const mintString = mint.map((nft) =>
        NFTUtils.encodeNFT(nft, this.version)
      )

      const isSingle =
        mintString.length === 1 && (!this.hasSupport || this.hasCarbonOffset)

      const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll
      const args = isSingle
        ? mintString[0]
        : [...mintString.map(this.toRemark), ...(await canSupport(true, 3))]

      const tx = await exec(
        this.accountId,
        '',
        cb,
        [args],
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[NFT] Saved ${this.nft.edition} entries in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false

            if (this.nft.price) {
              this.listForSale(mint, blockNumber)
            } else {
              this.navigateToDetail(mint[0], blockNumber)
            }
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          (res) => this.resolveStatus(res.status, true)
        )
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

  public async listForSale(remarks: NFT[], originalBlockNumber: string) {
    try {
      const { api } = Connector.getInstance()
      this.isLoading = true

      const { version } = this
      const { price } = this.nft
      showNotification(
        `[APP] Listing NFT to sale for ${formatBalance(price, {
          decimals: this.decimals,
          withUnit: this.unit,
        })}`
      )

      const onlyNfts = remarks

        .map((nft) => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
        .map((nft) =>
          NFTUtils.createInteraction('LIST', version, nft.id, String(price))
        )

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.danger)
        return
      }

      const cb = api.tx.utility.batchAll
      const args = onlyNfts.map(this.toRemark)

      const tx = await exec(
        this.accountId,
        '',
        cb,
        [args],
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[LIST] Saved prices for ${
                onlyNfts.length
              } NFTs with tag ${formatBalance(price, {
                decimals: this.decimals,
                withUnit: this.unit,
              })} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
            this.navigateToDetail(remarks[0], originalBlockNumber)
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          (res) => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger)
    }
  }

  protected async estimateTx() {
    this.isLoading = true
    const { api } = Connector.getInstance()

    const mint = NFTUtils.createMultipleNFT(
      this.nft.edition,
      this.accountId,
      this.selectedCollection?.symbol || '',
      this.nft.name,
      unSanitizeIpfsUrl(''),
      this.alreadyMinted,
      this.postfix && this.nft.edition > 1 ? basicUpdateFunction : undefined
    )
    const remarks = mint.map((nft) => NFTUtils.encodeNFT(nft, this.version))

    const isSingle =
      remarks.length === 1 && (!this.hasSupport || this.hasCarbonOffset)
    const cb = api.tx.utility.batchAll

    const args = !this.hasSupport
      ? remarks.map(this.toRemark)
      : [...remarks.map(this.toRemark), ...(await canSupport(true, 3))]

    this.estimated = await estimate(this.accountId, cb, [args])

    this.isLoading = false
  }

  protected onTxError(dispatchError: DispatchError): void {
    const { api } = Connector.getInstance()
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.danger
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.danger
      )
    }

    this.isLoading = false
  }

  protected navigateToDetail(nft: NFT, blockNumber: string) {
    showNotification('You will go to the detail in 2 seconds')
    const go = () =>
      this.$router.push({
        path: `/rmrk/detail/${getNftId(nft, blockNumber)}`,
        query: { message: 'congrats' },
      })
    setTimeout(go, 2000)
  }
}
</script>
