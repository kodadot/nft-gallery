<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <h2 class="title is-size-3">
      <!-- {{ $t('mint.context') }} -->
      Create NFT Collectibles
    </h2>
    <p class="subtitle is-size-7">{{ $t('general.using') }} {{ version }}</p>
    <b-field>
      <div>
        {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
      </div>
    </b-field>
    <b-field>
      <Auth />
    </b-field>

    <MetadataUpload
      ref="nftUpload"
      v-model="file"
      required
      :label="$t('mint.nft.simpleDrop')"
      expanded
      preview
      data-cy="input-upload" />

    <BasicInput
      ref="nftNameInput"
      v-model="rmrkMint.name"
      required
      :label="$t('mint.nft.name.label')"
      :message="$t('mint.nft.name.message')"
      :placeholder="$t('mint.nft.name.placeholder')"
      expanded
      spellcheck="true"
      data-cy="input-name"
      @blur.native.capture="generateSymbol" />

    <BasicInput
      ref="nftSymbolInput"
      v-model="rmrkMint.symbol"
      required
      :label="$t('mint.collection.symbol.label')"
      :message="$t('mint.collection.symbol.message')"
      :placeholder="$t('mint.collection.symbol.placeholder')"
      maxlength="10"
      expanded
      data-cy="input-symbol"
      @keydown.native.space.prevent />

    <BasicInput
      v-model="meta.description"
      maxlength="500"
      type="textarea"
      spellcheck="true"
      class="mb-0 mt-5"
      :label="$t('mint.nft.description.label')"
      :message="$t('mint.nft.description.message')"
      :placeholder="$t('mint.nft.description.placeholder')"
      data-cy="input-description" />

    <b-field :label="$t('Edition')" class="mt-5" data-cy="input-edition">
      <b-numberinput
        v-model="rmrkMint.max"
        placeholder="1 is minumum"
        expanded
        :min="1"></b-numberinput>
    </b-field>

    <MetadataUpload
      v-if="secondaryFileVisible"
      v-model="secondFile"
      label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
      icon="file-image"
      accept="image/png, image/jpeg, image/gif"
      expanded
      preview />

    <AttributeTagInput
      v-model="rmrkMint.tags"
      placeholder="Get discovered easier through tags"
      data-cy="input-tags" />

    <BalanceInput
      :step="0.1"
      label="Price"
      expanded
      data-cy="input-price"
      @input="updateMeta" />
    <div class="content mt-3">
      <p>
        Hint: Setting the price now requires making an additional transaction.
      </p>
    </div>

    <b-field>
      <PasswordInput
        v-model="password"
        :account="accountId"
        data-cy="input-password" />
    </b-field>
    <b-field>
      <CollapseWrapper
        v-if="rmrkMint.max > 1"
        visible="mint.expert.show"
        hidden="mint.expert.hide"
        data-cy="input-advance-settings">
        <p class="title is-6" data-cy="input-valid-address">
          {{ $t('mint.expert.count', [parseAddresses.length]) }}
        </p>
        <p v-show="syncVisible" class="sub-title is-6 has-text-warning">
          {{ $t('mint.expert.countGlitch', [parseAddresses.length]) }}
        </p>
        <b-field :label="$t('mint.expert.batchSend')">
          <b-input
            v-model="batchAdresses"
            type="textarea"
            :placeholder="'Distribute NFTs to multiple addresses like this:\n- HjshJ....3aJk\n- FswhJ....3aVC\n- HjW3J....9c3V'"
            spellcheck="true"
            data-cy="input-batch-address"></b-input>
        </b-field>
        <BasicSlider
          v-model="distribution"
          label="action.distributionCount"
          data-cy="input-distribution" />
        <b-field v-show="syncVisible">
          <b-button
            outlined
            icon-left="sync"
            type="is-warning"
            @click="syncEdition"
            >{{ $t('mint.expert.sync', [actualDistribution]) }}</b-button
          >
        </b-field>
        <BasicSwitch
          v-model="random"
          label="action.random"
          data-cy="input-random" />
        <BasicSwitch
          v-model="postfix"
          label="mint.expert.postfix"
          data-cy="input-hashtag" />
      </CollapseWrapper>
    </b-field>
    <BasicSwitch v-model="nsfw" label="mint.nfsw" data-cy="input-nsfw" />
    <b-field type="is-danger" :message="haveNoToSMessage">
      <b-switch v-model="hasToS" :rounded="false" data-cy="input-tos">
        {{ $t('termOfService.accept') }}
      </b-switch>
    </b-field>
    <b-field v-if="isLogIn" type="is-danger" :message="balanceNotEnoughMessage">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        :loading="isLoading"
        outlined
        @click="sub">
        {{ $t('mint.submit') }}
      </b-button>
    </b-field>
    <b-field>
      <NeoIcon icon="calculator" />
      <span class="pr-2">{{ $t('mint.estimated') }}</span>
      <Money :value="estimated" inline data-cy="fee" />
      <span class="pl-2"> ({{ getUsdFromKsm().toFixed(2) }} USD) </span>
    </b-field>
  </section>
</template>

<script lang="ts">
import {
  sendFunction,
  shuffleFunction,
  toDistribute,
} from '@/components/accounts/utils'
import {
  isFileWithoutType,
  isSecondFileVisible,
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/utils/mintUtils'
import { generateId } from '@/components/rmrk/service/Consolidator'
import Support from '@/components/shared/Support.vue'
import collectionList from '@/queries/subsquid/rmrk/usedCollectionSymbolsByAccount.graphql'
import {
  DETAIL_TIMEOUT,
  IPFS_KODADOT_IMAGE_PLACEHOLDER,
} from '@/utils/constants'
import { uploadDirectWhenMultiple } from '@/utils/directUpload'
import { emptyObject } from '@/utils/empty'
import ChainMixin from '@/utils/mixins/chainMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import TransactionMixin from '@/utils/mixins/txMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'
import { notificationTypes, showNotification } from '@/utils/notification'
import correctFormat from '@/utils/ss58Format'
import { canSupport, feeTx } from '@/utils/support'
import exec, {
  estimate,
  execResultValue,
  txCb,
} from '@/utils/transactionExecutor'
import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import { Attribute, mapAsSystemRemark } from '@kodadot1/minimark/common'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'

import { findUniqueSymbol } from '@kodadot1/minimark/shared'
import { DispatchError } from '@polkadot/types/interfaces'
import { formatBalance } from '@polkadot/util'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { Component, Ref, Watch, mixins } from 'nuxt-property-decorator'
import Vue from 'vue'
import { unwrapSafe } from '@/utils/uniquery'
import NFTUtils, { MintType } from '../service/NftUtils'
import { NFT, NFTMetadata, SimpleNFT, getNftId } from '../service/scheme'
import { MediaType } from '../types'
import { resolveMedia } from '../utils'
import AuthMixin from '~/utils/mixins/authMixin'
import { useFiatStore } from '@/stores/fiat'
import { usePinningStore } from '@/stores/pinning'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoIcon } from '@kodadot1/brick'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('./DropUpload.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  Tooltip: () => import('@/components/shared/Tooltip.vue'),
  Support,
  AttributeTagInput: () => import('./AttributeTagInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  Money: () => import('@/components/shared/format/BasicMoney.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseWrapper: () =>
    import('@/components/shared/collapse/CollapseWrapper.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  NeoIcon,
}

@Component<SimpleMint>({
  components,
})
export default class SimpleMint extends mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin,
  PrefixMixin,
  UseApiMixin,
  AuthMixin
) {
  private rmrkMint: SimpleNFT = {
    ...emptyObject<SimpleNFT>(),
    max: 1,
  }
  private meta: NFTMetadata = emptyObject<NFTMetadata>()
  private uploadMode = true
  private file: File | null = null
  private secondFile: File | null = null
  private password = ''
  private hasToS = false
  private nsfw = false
  private price = 0
  private estimated = ''
  protected batchAdresses = ''
  protected postfix = true
  protected random = false
  protected distribution = 100
  protected first = 100
  protected usedCollectionSymbols: string[] = []
  protected balanceNotEnough = false
  protected haveNoToS = false

  private fiatStore = useFiatStore()
  private pinningStore = usePinningStore()
  private preferencesStore = usePreferencesStore()

  @Ref('nftUpload') readonly nftUpload
  @Ref('nftNameInput') readonly nftNameInput
  @Ref('nftSymbolInput') readonly nftSymbolInput

  layout() {
    return 'centered-half-layout'
  }

  get balanceNotEnoughMessage() {
    return this.balanceNotEnough ? this.$t('tooltip.notEnoughBalance') : ''
  }

  get haveNoToSMessage() {
    return this.haveNoToS ? this.$t('tooltip.haveNoToS') : ''
  }

  // query for nfts information by accountId
  public async created() {
    this.$apollo.addSmartQuery('collections', {
      query: collectionList,
      client: this.client,
      manual: true,
      loadingKey: 'isLoading',
      result: this.handleResult,
      variables: () => {
        return {
          account: this.accountId,
          first: this.first,
        }
      },
      fetchPolicy: 'cache-and-network',
    })
  }

  // handle query results
  public handleResult(data: any) {
    const collectionEntities = data?.data?.collectionEntities
    if (collectionEntities) {
      this.usedCollectionSymbols = unwrapSafe(collectionEntities).map(
        ({ symbol }) => symbol
      )
    }
  }

  // set symbol name
  private generateSymbol(): void {
    if (!this.rmrkMint?.symbol && this.rmrkMint.name?.length) {
      const symbol = this.generateSymbolCore(
        this.rmrkMint.name,
        this.usedCollectionSymbols
      )
      Vue.set(this.rmrkMint, 'symbol', symbol)
    }
  }

  // core: to generate symbol
  private generateSymbolCore(name: string, usedSymbols: string[]): string {
    let symbol = name.replaceAll(' ', '_')
    symbol = findUniqueSymbol(symbol, usedSymbols)
    return symbol.slice(0, 10).toUpperCase() // symbol's length have to smaller than 10
  }

  protected updateMeta(value: number): void {
    this.price = value

    if (this.canCalculateTransactionFees) {
      this.estimateTx()
    }
  }

  get fileType(): MediaType {
    return resolveMedia(this.file?.type)
  }

  get secondaryFileVisible(): boolean {
    const fileType = this.fileType
    return (
      isFileWithoutType(this.file, fileType) || isSecondFileVisible(fileType)
    )
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.rmrkMint?.symbol || '')
  }

  get canCalculateTransactionFees(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return !!(this.price && name && symbol && max)
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return (
      !(
        name &&
        symbol &&
        max &&
        this.hasToS &&
        this.accountId &&
        this.file &&
        !this.syncVisible
      ) || this.isMintDisabled
    )
  }

  get hasSupport(): boolean {
    return this.preferencesStore.hasSupport
  }

  get hasCarbonOffset() {
    return this.preferencesStore.getHasCarbonOffset
  }

  set hasCarbonOffset(value: boolean) {
    this.preferencesStore.setHasCarbonOffset(value)
  }

  public checkValidity() {
    return (
      this.nftUpload.checkValidity() &&
      this.nftNameInput.checkValidity() &&
      this.nftSymbolInput.checkValidity()
    )
  }

  protected async estimateTx() {
    const { accountId, version } = this
    const api = await this.useApi()

    const toRemark = mapAsSystemRemark(api)

    const result = NFTUtils.generateRemarks(this.rmrkMint, accountId, version)
    const cb = api.tx.utility.batchAll
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
          NFTUtils.toString(result.collection, version),
          ...result.nfts.map((nft) => NFTUtils.toString(nft, version)),
        ]

    const args = !this.hasSupport
      ? remarks.map(toRemark)
      : [
          ...remarks.map(toRemark),
          ...(await canSupport(api, this.hasSupport, 3)),
        ]

    this.estimated = await estimate(this.accountId, cb, [args])
  }

  get enoughTokens(): boolean {
    return this.parseAddresses.length <= this.rmrkMint.max
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  get parseAddresses(): string[] {
    const { batchAdresses } = this
    const addresses = batchAdresses
      .split('\n')
      .map((x) => x.split('-'))
      .filter((x) => x.length)
      .map((x) => x[1])
      .filter((x) => x)
      .map((a) => a.trim())
    const onlyValid = addresses
      .filter((a) => isAddress(a))
      .map((a) => encodeAddress(a, correctFormat(this.ss58Format)))

    return onlyValid
  }

  get syncVisible(): boolean {
    return this.rmrkMint.max < this.actualDistribution
  }

  get actualDistribution(): number {
    return toDistribute(this.parseAddresses.length, this.distribution)
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  get isMintDisabled(): boolean {
    return Number(this.balance) < Number(this.estimated)
  }

  protected syncEdition(): void {
    this.rmrkMint.max = this.actualDistribution
  }

  protected async sub(): Promise<void> {
    if (!this.checkValidity()) {
      return
    }
    if (!this.hasToS) {
      this.haveNoToS = true
      return
    }
    if (this.isMintDisabled) {
      this.balanceNotEnough = true
      return
    }
    this.isLoading = true
    this.status = 'loader.ipfs'
    const { accountId, version } = this
    const api = await this.useApi()
    const toRemark = mapAsSystemRemark(api)

    try {
      const meta = await this.constructMeta()
      this.rmrkMint.metadata = meta || ''

      const result = NFTUtils.generateRemarks(
        this.rmrkMint,
        accountId,
        version,
        false,
        this.postfix && this.rmrkMint.max > 1
          ? (name: string, index: number) => `${name} #${index + 1}`
          : undefined
      ) as MintType

      const cb = api.tx.utility.batchAll
      const remarks: string[] = Array.isArray(result)
        ? result
        : [
            NFTUtils.toString(result.collection, version),
            ...result.nfts.map((nft) => NFTUtils.toString(nft, version)),
          ]

      const args = !this.hasSupport
        ? remarks.map(toRemark)
        : [
            ...remarks.map(toRemark),
            ...(await canSupport(api, this.hasSupport, 3)),
          ]

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

            if (this.batchAdresses) {
              this.sendBatch(result.nfts, blockNumber)
            } else if (this.price) {
              this.listForSale(result.nfts, blockNumber)
            } else {
              this.navigateToDetail(result.nfts[0], blockNumber)
            }

            showNotification(
              `[NFT] Saved ${this.rmrkMint.max} entries in block ${blockNumber}`,
              notificationTypes.success
            )

            if (!this.batchAdresses || !this.price) {
              this.isLoading = false
            }
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
      if (e instanceof Error) {
        showNotification(e.toString(), notificationTypes.warn)
        this.isLoading = false
      }
    }
  }

  public async fetchRandomSeed(): Promise<number[]> {
    const api = await this.useApi()
    const random = await api.query.babe.randomness()
    return Array.from(random)
  }

  protected async sendBatch(
    remarks: NFT[],
    originalBlockNumber: string
  ): Promise<void> {
    try {
      // TODO: WORK WITH V2
      const { price } = this
      const addresses = this.parseAddresses
      showNotification(`[APP] Sending NFTs to ${addresses.length} adresses`)

      const onlyNfts = remarks
        .filter(NFTUtils.isNFT)
        .map((nft) => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
      // .map(nft =>
      //   NFTUtils.createInteraction('SEND', version, nft.id, String(price))
      // )

      if (!onlyNfts.length) {
        showNotification('Can not send empty NFTs', notificationTypes.warn)
        return
      }

      const api = await this.useApi()
      const toRemark = mapAsSystemRemark(api)
      const outOfTheNamesForTheRemarks = sendFunction(
        addresses,
        this.distribution,
        this.random ? shuffleFunction(await this.fetchRandomSeed()) : undefined
      )(
        onlyNfts.map((nft) => nft.id),
        this.version
      )
      const restOfTheRemarks =
        onlyNfts.length > addresses.length && this.price
          ? onlyNfts
              .slice(outOfTheNamesForTheRemarks.length)
              .map((nft) =>
                createInteraction(Interaction.LIST, nft.id, String(price))
              )
          : []

      this.isLoading = true

      const cb = api.tx.utility.batchAll
      const args = [...outOfTheNamesForTheRemarks, ...restOfTheRemarks].map(
        toRemark
      )

      const estimatedFee = await estimate(this.accountId, cb, [args])
      const support = feeTx(api, estimatedFee)
      args.push(support)

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
              `[SEND] Saved prices for ${
                this.rmrkMint.max
              } NFTs with tag ${formatBalance(price, {
                decimals: this.decimals,
                withUnit: this.unit,
              })} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
            const firstNft = remarks.find(NFTUtils.isNFT)

            if (firstNft) {
              this.navigateToDetail(firstNft, originalBlockNumber)
            }
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          }
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.message, notificationTypes.warn)
        this.isLoading = false
      }
    }
  }

  protected async onTxError(dispatchError: DispatchError): Promise<void> {
    const api = await this.useApi()
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.warn
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.warn
      )
    }

    this.isLoading = false
  }

  public async listForSale(remarks: NFT[], originalBlockNumber: string) {
    try {
      const { price, version } = this
      showNotification(
        `[APP] Listing NFT to sale for ${formatBalance(price, {
          decimals: this.decimals,
          withUnit: this.unit,
        })}`
      )

      const onlyNfts = remarks
        .filter(NFTUtils.isNFT)
        .map((nft) => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
        .map((nft) =>
          createInteraction(Interaction.LIST, version, nft.id, String(price))
        )

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.warn)
        return
      }

      this.isLoading = true
      const api = await this.useApi()
      const toRemark = mapAsSystemRemark(api)

      const cb = api.tx.utility.batchAll
      const args = onlyNfts.map(toRemark)

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
                this.rmrkMint.max
              } NFTs with tag ${formatBalance(price, {
                decimals: this.decimals,
                withUnit: this.unit,
              })} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
            const firstNft = remarks.find(NFTUtils.isNFT)

            if (firstNft) {
              this.navigateToDetail(firstNft, originalBlockNumber)
            }
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          }
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        showNotification(e.message, notificationTypes.warn)
        this.isLoading = false
      }
    }
  }

  public nsfwAttribute(): Attribute[] {
    if (!this.nsfw) {
      return []
    }

    return [{ trait_type: 'NSFW', value: Number(this.nsfw) }]
  }

  public offsetAttribute(): Attribute[] {
    if (!this.hasCarbonOffset) {
      return []
    }

    return [{ trait_type: 'carbonless', value: Number(this.hasCarbonOffset) }]
  }

  public async constructMeta(): Promise<string | undefined> {
    const { file, secondFile, rmrkMint, meta: m } = this
    if (!file) {
      throw new ReferenceError('No file found!')
    }
    const { token } = await this.pinningStore.fetchPinningKey(this.accountId)

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
      ...nsfwAttribute(this.nsfw),
      ...offsetAttribute(this.hasCarbonOffset),
    ]

    const meta = createMetadata(
      rmrkMint.name,
      m.description || '',
      imageHash,
      animationUrl,
      attributes,
      'https://kodadot.xyz',
      file.type
    )

    const metaHash = await pinJson(meta, imageHash)

    uploadDirectWhenMultiple(
      [file, secondFile],
      [fileHash, secondFileHash]
    ).catch(this.$consola.warn)
    return unSanitizeIpfsUrl(metaHash)
  }

  protected navigateToDetail(nft: NFT, blockNumber: string) {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const go = () =>
      this.$router.push({
        path: `/rmrk/gallery/${getNftId(nft, blockNumber)}`,
        query: { congratsNft: nft.name },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }

  protected getUsdFromKsm() {
    const KSMVal = formatBalance(this.estimated, {
      decimals: this.decimals,
      withUnit: false,
      forceUnit: '-',
    })

    return Number(this.fiatStore.getCurrentKSMValue) * Number(KSMVal)
  }

  @Watch('rmrkMint', { deep: true })
  rmrkMintObjectChanged(): void {
    if (this.canCalculateTransactionFees) {
      this.estimateTx()
    }
  }
}
</script>
