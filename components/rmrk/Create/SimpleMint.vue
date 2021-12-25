<template>
  <div class="columns mb-6">
    <div class="column is-6 is-offset-3">
      <section>
        <br />
        <Loader v-model="isLoading" :status="status" />
        <div class="box">
          <p class="title is-size-3">
            <!-- {{ $t('mint.context') }} -->
            Create NFT Collectibles
          </p>
          <p class="subtitle is-size-7">{{ $t('using') }} {{ version }}</p>
          <b-field>
            <div>
              {{ $t('computed id') }}: <b>{{ rmrkId }}</b>
            </div>
          </b-field>
          <b-field>
            <Auth />
          </b-field>

          <MetadataUpload
            v-model="file"
            label="Drop your NFT here or click to upload or simply paste image from clipboard. We support various media types (BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON)"
            expanded
            preview
          />

          <BasicInput
            v-model="rmrkMint.name"
            :label="$t('mint.nft.name.label')"
            :message="$t('mint.nft.name.message')"
            :placeholder="$t('mint.nft.name.placeholder')"
            expanded
            spellcheck="true"
          />

          <BasicInput
            v-model="rmrkMint.symbol"
            :label="$t('mint.collection.symbol.label')"
            :message="$t('mint.collection.symbol.message')"
            :placeholder="$t('mint.collection.symbol.placeholder')"
            @keydown.native.space.prevent
            maxlength="10"
            expanded
          />

          <BasicInput
            v-model="meta.description"
            maxlength="500"
            type="textarea"
            spellcheck="true"
            class="mb-0 mt-5"
            :label="$t('mint.nft.description.label')"
            :message="$t('mint.nft.description.message')"
            :placeholder="$t('mint.nft.description.placeholder')"
          />

          <b-field :label="$i18n.t('Edition')" class="mt-5">
            <b-numberinput
              v-model="rmrkMint.max"
              placeholder="1 is minumum"
              expanded
              :min="1"
            ></b-numberinput>
          </b-field>

          <MetadataUpload
            v-if="secondaryFileVisible"
            label="Your NFT requires a poster/cover to be seen in gallery. Please upload image (jpg/ png/ gif)"
            v-model="secondFile"
            icon="file-image"
            accept="image/png, image/jpeg, image/gif"
            expanded
            preview
          />
          <AttributeTagInput
            v-model="rmrkMint.tags"
            placeholder="Get discovered easier through tags"
          />

          <BalanceInput @input="updateMeta" label="Price" expanded />
          <b-message
            v-if="price"
            icon="exclamation-triangle"
            class="mt-3"
            title="Additional transaction"
            type="is-primary"
            has-icon
            aria-close-label="Close message"
          >
            <span class="has-text-primary"
              >Setting the price now requires making an additional
              transaction.</span
            >
          </b-message>

          <b-field>
            <PasswordInput v-model="password" :account="accountId" />
          </b-field>
          <b-field>
            <CollapseWrapper
              v-if="rmrkMint.max > 1"
              visible="mint.expert.show"
              hidden="mint.expert.hide"
            >
              <p class="title is-6">
                {{ $t('mint.expert.count', [parseAddresses.length]) }}
              </p>
              <p class="sub-title is-6 has-text-warning" v-show="syncVisible">
                {{ $t('mint.expert.countGlitch', [parseAddresses.length]) }}
              </p>
              <b-field :label="$i18n.t('mint.expert.batchSend')">
                <b-input
                  v-model="batchAdresses"
                  type="textarea"
                  placeholder="Distribute nfts to multiple addresses"
                  spellcheck="true"
                ></b-input>
              </b-field>
              <BasicSlider
                v-model="distribution"
                label="action.distributionCount"
              />
              <b-field v-show="syncVisible">
              <b-button outlined @click="syncEdition" icon-left="sync" type="is-warning">{{ $t('mint.expert.sync', [actualDistribution]) }}</b-button>
              </b-field>
              <BasicSwitch v-model="random" label="action.random" />
              <BasicSwitch v-model="postfix" label="mint.expert.postfix" />
            </CollapseWrapper>
          </b-field>
          <b-field>
            <b-button
              type="is-primary"
              icon-left="paper-plane"
              @click="sub"
              :disabled="disabled"
              :loading="isLoading"
              outlined
            >
              {{ $t('mint.submit') }}
            </b-button>
          </b-field>
          <b-field>
            <b-button
              type="is-text"
              icon-left="calculator"
              @click="estimateTx"
              :disabled="disabled"
              :loading="isLoading"
              outlined
            >
              <template v-if="!estimated">
                {{ $t('mint.estimate') }}
              </template>
              <template v-else>
                {{ $t('mint.estimated') }}
                <Money :value="estimated" inline />
              </template>
            </b-button>
          </b-field>
          <BasicSwitch v-model="nsfw" label="mint.nfsw" />
          <b-field>
            <Support v-model="hasSupport" :price="filePrice">
              <template v-slot:tooltip>
                <Tooltip
                  :label="$t('support.tooltip')"
                  iconsize="is-small"
                  buttonsize="is-small"
                  tooltipsize="is-medium"
                />
              </template>
            </Support>
          </b-field>
          <b-field>
            <Support
              v-model="hasCarbonOffset"
              :price="1"
              :activeMessage="$t('carbonOffset.carbonOffsetYes')"
              :passiveMessage="$t('carbonOffset.carbonOffsetNo')"
            >
              <template v-slot:tooltip>
                <Tooltip
                  iconsize="is-small"
                  buttonsize="is-small"
                  tooltipsize="is-large"
                >
                  <template v-slot:content>
                    {{ $t('carbonOffset.tooltip') }}
                    (<a class="has-text-black is-underlined" href='https://kodadot.xyz/carbonless'>https://kodadot.xyz/carbonless</a>)
                  </template>
                </Tooltip>
              </template>
            </Support>
          </b-field>
          <ArweaveUploadSwitch v-model="arweaveUpload">
            <template v-slot:tooltip>
              <Tooltip
                :label="$t('arweave.tooltip')"
                iconsize="is-small"
                buttonsize="is-small"
                tooltipsize="is-medium"
              />
            </template>
          </ArweaveUploadSwitch>
          <b-field>
            <b-switch v-model="hasToS" :rounded="false">
              {{ $t('termOfService.accept') }}
            </b-switch>
          </b-field>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { MediaType } from '../types'
import { emptyObject } from '@/utils/empty'
import Support from '@/components/shared/Support.vue'
import Connector from '@vue-polkadot/vue-api'
import exec, {
  execResultValue,
  txCb,
  estimate,
} from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import {
  Attribute,
  SimpleNFT,
  NFTMetadata,
  NFT,
  getNftId,
} from '../service/scheme'
import { unSanitizeIpfsUrl } from '@/utils/ipfs'
import { pinJson, getKey, revokeKey } from '@/utils/proxy'
import { formatBalance } from '@polkadot/util'
import { generateId } from '@/components/rmrk/service/Consolidator'
import { supportTx, calculateCost, offsetTx, feeTx } from '@/utils/support'
import { resolveMedia } from '../utils'
import NFTUtils, { MintType } from '../service/NftUtils'
import { DispatchError } from '@polkadot/types/interfaces'
import { ipfsToArweave } from '@/utils/ipfs'
import { APIKeys, pinFile as pinFileToIPFS } from '@/utils/pinata'
import TransactionMixin from '@/utils/mixins/txMixin'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import ChainMixin from '@/utils/mixins/chainMixin'
import correctFormat from '@/utils/ss58Format'
import { isFileWithoutType, isSecondFileVisible } from './mintUtils'
import { sendFunction, shuffleFunction, toDistribute } from '@/components/accounts/utils'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('./DropUpload.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  Tooltip: () => import('@/components/shared/Tooltip.vue'),
  Support,
  AttributeTagInput: () => import('./AttributeTagInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  ArweaveUploadSwitch: () => import('./ArweaveUploadSwitch.vue'),
  CollapseWrapper: () =>
    import('@/components/shared/collapse/CollapseWrapper.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SendHandler: () => import('@/components/rmrk/Create/Admin/SendHandler.vue'),
  BasicSlider: () => import('@/components/shared/form/BasicSlider.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
}

@Component<SimpleMint>({
  metaInfo() {
    return {
      meta: [
        {
          property: 'og:title',
          content: 'KodaDot | Low fees and low carbon minting',
        },
        { property: 'og:url', content: 'https://nft.kodadot.xyz' },
        {
          property: 'og:description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
        {
          property: 'og:site_name',
          content: 'Low fees and low carbon minting',
        },
        {
          property: 'og:image',
          content: 'https://nft.kodadot.xyz/kodadot_mint.jpg',
        },
        {
          property: 'twitter:title',
          content: 'Low fees and low carbon minting',
        },
        {
          property: 'twitter:description',
          content: 'Create carbonless NFTs with low on-chain fees',
        },
        {
          property: 'twitter:image',
          content: 'https://nft.kodadot.xyz/kodadot_mint.jpg',
        },
      ],
    }
  },
  components,
})
export default class SimpleMint extends mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin
) {
  private rmrkMint: SimpleNFT = {
    ...emptyObject<SimpleNFT>(),
    max: 1,
  }
  private meta: NFTMetadata = emptyObject<NFTMetadata>()
  // private accountId: string = '';
  private uploadMode = true
  private file: Blob | null = null
  private secondFile: Blob | null = null
  private password = ''
  private hasToS = false
  private hasSupport = true
  private nsfw = false
  private price = 0
  private estimated = ''
  private hasCarbonOffset = true
  protected arweaveUpload = false
  protected batchAdresses = ''
  protected postfix = true
  protected random = false
  protected distribution = 100

  protected updateMeta(value: number): void {
    this.price = value
  }

  get fileType(): MediaType {
    return resolveMedia(this.file?.type)
  }

  get secondaryFileVisible(): boolean {
    const fileType = this.fileType
    return isFileWithoutType(this.file, fileType) || isSecondFileVisible(fileType)
  }

  get accountId(): string {
    return this.$store.getters.getAuthAddress
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.rmrkMint?.symbol || '')
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return !(
      name &&
      symbol &&
      max &&
      this.hasToS &&
      this.accountId &&
      this.file &&
      !this.syncVisible
    )
  }

  protected async estimateTx() {
    this.isLoading = true
    const { accountId, version } = this
    const { api } = Connector.getInstance()

    const result = NFTUtils.generateRemarks(this.rmrkMint, accountId, version)
    const cb = api.tx.utility.batchAll
    const remarks: string[] = Array.isArray(result)
      ? result
      : [
        NFTUtils.toString(result.collection, version),
        ...result.nfts.map((nft) => NFTUtils.toString(nft, version)),
      ]

    const args = !this.hasSupport
      ? remarks.map(this.toRemark)
      : [
        ...remarks.map(this.toRemark),
        ...(await this.canSupport()),
        ...(await this.canOffset()),
      ]

    this.estimated = await estimate(this.accountId, cb, [args])

    this.isLoading = false
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
    return (this.rmrkMint.max < this.actualDistribution)
  }

  get actualDistribution(): number {
    return toDistribute(this.parseAddresses.length, this.distribution)
  }

  protected syncEdition(): void {
    this.rmrkMint.max = this.actualDistribution
  }

  protected async sub(): Promise<void> {
    this.isLoading = true
    this.status = 'loader.ipfs'
    const { accountId, version } = this
    const { api } = Connector.getInstance()

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
        ? remarks.map(this.toRemark)
        : [
          ...remarks.map(this.toRemark),
          ...(await this.canSupport()),
          ...(await this.canOffset()),
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
        showNotification(e.toString(), notificationTypes.danger)
        this.isLoading = false
      }
    }
  }

  public async fetchRandomSeed(): Promise<number[]> {
    const { api } = Connector.getInstance()
    const random = await api.query.babe.randomness()
    return Array.from(random)

  }

  protected async sendBatch(remarks: NFT[], originalBlockNumber: string): Promise<void> {
    try {
      const { version, price } = this
      const addresses = this.parseAddresses
      showNotification(`[APP] Sending NFTs to ${addresses.length} adresses`)

      const onlyNfts = remarks
        .filter(NFTUtils.isNFT)
        .map((nft) => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
      // .map(nft =>
      //   NFTUtils.createInteraction('SEND', version, nft.id, String(price))
      // )

      if (!onlyNfts.length) {
        showNotification('Can not send empty NFTs', notificationTypes.danger)
        return
      }

      const { api } = Connector.getInstance()
      const outOfTheNamesForTheRemarks = sendFunction(addresses, this.distribution, this.random ? shuffleFunction(await this.fetchRandomSeed()) : undefined )(onlyNfts.map(nft => nft.id), this.version)
      const restOfTheRemarks = onlyNfts.length > addresses.length && this.price ? onlyNfts.slice(outOfTheNamesForTheRemarks.length).map(nft => NFTUtils.createInteraction('LIST', version, nft.id, String(price))) : []

      this.isLoading = true

      const cb = api.tx.utility.batchAll
      const args = [...outOfTheNamesForTheRemarks, ...restOfTheRemarks].map(
        this.toRemark
      )

      const estimatedFee = await estimate(this.accountId, cb, [args])
      const support = feeTx(estimatedFee)
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
        showNotification(e.message, notificationTypes.danger)
        this.isLoading = false
      }
    }
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

  get chainProperties() {
    return this.$store.getters['chain/getChainProperties']
  }

  get decimals(): number {
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {
    return this.chainProperties.tokenSymbol
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
          NFTUtils.createInteraction('LIST', version, nft.id, String(price))
        )

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.danger)
        return
      }

      this.isLoading = true
      const { api } = Connector.getInstance()

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
        showNotification(e.message, notificationTypes.danger)
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

  get filePrice() {
    return calculateCost(this.file)
  }

  public async constructMeta(): Promise<string | undefined> {
    if (!this.file) {
      throw new ReferenceError('No file found!')
    }

    this.meta = {
      ...this.meta,
      attributes: [
        ...(this.rmrkMint?.tags || []),
        ...this.nsfwAttribute(),
        ...this.offsetAttribute(),
      ],
      external_url: 'https://nft.kodadot.xyz',
      type: this.file.type,
    }

    try {
      const keys: APIKeys = await getKey(this.accountId)
      const fileHash = await pinFileToIPFS(this.file, keys)

      if (!this.secondaryFileVisible) {
        this.meta.image = unSanitizeIpfsUrl(fileHash)
        this.meta.image_ar = this.arweaveUpload
          ? await ipfsToArweave(fileHash)
          : ''
      } else {
        this.meta.animation_url = unSanitizeIpfsUrl(fileHash)
        if (this.secondFile) {
          const coverImageHash = await pinFileToIPFS(this.secondFile, keys)
          this.meta.image = unSanitizeIpfsUrl(coverImageHash)
        }
      }

      revokeKey(keys.pinata_api_key).then(console.log, console.warn)
      // TODO: upload meta to IPFS
      const metaHash = await pinJson(this.meta)
      return unSanitizeIpfsUrl(metaHash)
    } catch (e) {
      if (e instanceof Error) {
        throw new ReferenceError(e.message)
      }
    }
  }

  protected async canSupport() {
    if (this.hasSupport && this.file) {
      return [await supportTx(this.file)]
    }

    return []
  }

  protected async canOffset() {
    if (this.hasCarbonOffset) {
      return [await offsetTx(1)]
    }

    return []
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance()
    return api.tx.system.remark(remark)
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

