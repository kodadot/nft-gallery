<template>
  <div>
    <div class="box">
      <Loader v-model="isLoading" :status="status" />
      <b-field>
        <Auth />
      </b-field>
      <template v-if="accountId">
        <b-field :label="$i18n.t('Collection')" :message="$t('Select collection where do you want mint your token')">
          <b-select
            placeholder="Select a collection"
            v-model="selectedCollection"
            expanded
          >
            <option disabled selected value=""> -- </option>
            <option
              v-for="option in collections"
              :value="option"
              :key="option.id"
            >
              {{ option.name }} {{ option.id }} {{ option.alreadyMinted }}/{{
                option.max || Infinity
              }}
            </option>
          </b-select>
        </b-field>
      </template>
      <h6 v-if="selectedCollection" class="subtitle is-6">
        You have minted {{ selectedCollection.alreadyMinted }} out of
        {{ selectedCollection.max || Infinity }}
      </h6>
      <CreateItem
        v-if="selectedCollection"
        v-bind.sync="nft"
        :max="selectedCollection.max"
        :alreadyMinted="selectedCollection.alreadyMinted"
      />
      <b-field>
        <CollapseWrapper
          v-if="nft.edition > 1"
          visible="mint.expert.show"
          hidden="mint.expert.hide"
          class="mt-3"
        >
          <BasicSwitch class="mt-3" v-model="postfix" label="mint.expert.postfix" />
        </CollapseWrapper>
      </b-field>
      <b-field>
        <PasswordInput v-model="password" :account="accountId" />
      </b-field>
      <b-field>
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          @click="submit"
          :disabled="disabled"
          :loading="isLoading"
          outlined
        >
          {{ $t("mint.submit") }}
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
            {{ $t("mint.estimate") }}
          </template>
          <template v-else>
            {{ $t("mint.estimated") }}
            <Money :value="estimated" inline />
          </template>
        </b-button>
      </b-field>
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
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import CreateItem from './CreateItem.vue'
import Tooltip from '@/components/shared/Tooltip.vue'
import Support from '@/components/shared/Support.vue'
import Connector from '@vue-polkadot/vue-api'
import exec, {
  execResultValue,
  txCb,
  estimate
} from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import { NFT, NFTMetadata, MintNFT, getNftId } from '../service/scheme'
import { pinJson, getKey, revokeKey } from '@/proxy'
import { unSanitizeIpfsUrl, ipfsToArweave } from '@/utils/ipfs'
import PasswordInput from '@/components/shared/PasswordInput.vue'
import NFTUtils, { basicUpdateFunction } from '../service/NftUtils'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { supportTx, MaybeFile, calculateCost, offsetTx } from '@/utils/support'
import collectionForMint from '@/queries/collectionForMint.graphql'
import TransactionMixin from '@/utils/mixins/txMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible
} from './mintUtils'
import { formatBalance } from '@polkadot/util'
import { DispatchError } from '@polkadot/types/interfaces'
import { APIKeys, pinFile as pinFileToIPFS } from '@/pinata'

interface NFTAndMeta extends NFT {
  meta: NFTMetadata;
}

type MintedCollection = {
  id: string;
  name: string;
  alreadyMinted: number;
  max: number;
  metadata: string;
  symbol: string;
};

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    CreateItem,
    PasswordInput,
    Tooltip,
    Support,
    Money: () => import('@/components/shared/format/Money.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    ArweaveUploadSwitch: () => import('./ArweaveUploadSwitch.vue'),
    CollapseWrapper: () =>
      import('@/components/shared/collapse/CollapseWrapper.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  }
})
export default class CreateToken extends mixins(
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin
) {
  protected nft: MintNFT = {
    name: '',
    description: '',
    edition: 1,
    tags: [],
    nsfw: false,
    price: 0,
    file: undefined,
    secondFile: undefined
  };
  protected collections: MintedCollection[] = [];
  private selectedCollection: MintedCollection | null = null;

  private password = '';
  private alreadyMinted = 0;
  private hasSupport = true;
  private estimated = '';
  private hasCarbonOffset = true;
  private filePrice = 0;
  protected arweaveUpload = false;
  protected postfix = true;

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
      variables: {
        account: this.accountId
      },
      fetchPolicy: 'network-only'
    })

    const {
      data: { collectionEntities }
    } = collections

    this.collections = collectionEntities.nodes
      ?.map((ce: any) => ({
        ...ce,
        alreadyMinted: ce.nfts?.totalCount
      }))
      .filter(
        (ce: MintedCollection) => (ce.max || Infinity) - ce.alreadyMinted > 0
      )
  }

  get disabled() {
    return !(this.nft.name && this.nft.file && this.selectedCollection)
  }

  @Watch('nft.file')
  @Watch('nft.secondFile')
  private calculatePrice() {
    this.filePrice = calculateCost(
      ([this.nft.file, this.nft.secondFile] as MaybeFile[]).filter(
        a => typeof a !== 'undefined'
      )
    )
  }

  private toRemark(remark: string) {
    const { api } = Connector.getInstance()
    return api.tx.system.remark(remark)
  }

  protected async canSupport() {
    if (this.hasSupport) {
      return [
        await supportTx([
          this.nft.file as MaybeFile,
          this.nft.secondFile as MaybeFile
        ])
      ]
    }

    return []
  }

  protected async canOffset() {
    if (this.hasCarbonOffset) {
      return [await offsetTx(1)]
    }

    return []
  }

  protected async submit() {
    if (!this.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { api } = Connector.getInstance()
    const { alreadyMinted, symbol } = this.selectedCollection

    try {
      const metadata = await this.constructMeta()
      // missin possibility to handle more than one remark

      const mint = NFTUtils.createMultipleNFT(
        this.nft.edition,
        this.accountId,
        symbol,
        this.nft.name,
        metadata,
        alreadyMinted,
        this.postfix && this.nft.edition > 1 ? basicUpdateFunction : undefined
      )
      const mintString = mint.map(nft => NFTUtils.encodeNFT(nft, this.version))

      const isSingle =
        mintString.length === 1 && (!this.hasSupport || this.hasCarbonOffset)

      const cb = isSingle ? api.tx.system.remark : api.tx.utility.batchAll
      const args = isSingle
        ? mintString[0]
        : [
          ...mintString.map(this.toRemark),
          ...(await this.canSupport()),
          ...(await this.canOffset())
        ]

      const tx = await exec(
        this.accountId,
        '',
        cb,
        [args],
        txCb(
          async blockHash => {
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
          dispatchError => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          res => this.resolveStatus(res.status, true)
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
    if (!this.nft.file) {
      throw new ReferenceError('No file found!')
    }

    const meta: NFTMetadata = {
      name: this.nft.name,
      description: this.nft.description,
      attributes: [
        ...(this.nft?.tags || []),
        ...nsfwAttribute(this.nft.nsfw),
        ...offsetAttribute(this.hasCarbonOffset)
      ],
      external_url: 'https://nft.kodadot.xyz',
      type: this.nft.file.type
    }

    try {
      const keys: APIKeys = await getKey(this.accountId)
      const fileHash = await pinFileToIPFS(this.nft.file, keys)

      if (!secondaryFileVisible(this.nft.file)) {
        meta.image = unSanitizeIpfsUrl(fileHash)
        meta.image_ar = this.arweaveUpload ? await ipfsToArweave(fileHash) : ''
      } else {
        meta.animation_url = unSanitizeIpfsUrl(fileHash)
        if (this.nft.secondFile) {
          const coverImageHash = await pinFileToIPFS(this.nft.secondFile, keys)
          meta.image = unSanitizeIpfsUrl(coverImageHash)
        }
      }

      revokeKey(keys.pinata_api_key).then(console.log, console.warn)

      // TODO: upload meta to IPFS
      const metaHash = await pinJson(meta)
      return unSanitizeIpfsUrl(metaHash)
    } catch (e) {
      throw new ReferenceError((e as Error).message)
    }
  }

  protected calculateSerialNumber(index: number) {
    return String(index + this.alreadyMinted + 1).padStart(16, '0')
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
          withUnit: this.unit
        })}`
      )

      const onlyNfts = remarks

        .map(nft => ({ ...nft, id: getNftId(nft, originalBlockNumber) }))
        .map(nft =>
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
          async blockHash => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[LIST] Saved prices for ${
                onlyNfts.length
              } NFTs with tag ${formatBalance(price, {
                decimals: this.decimals,
                withUnit: this.unit
              })} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
            this.navigateToDetail(remarks[0], originalBlockNumber)
          },
          dispatchError => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          res => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.danger)
    }
  }

  protected async estimateTx() {
    this.isLoading = true
    const { accountId, version } = this
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
    const remarks = mint.map(nft => NFTUtils.encodeNFT(nft, this.version))

    const isSingle =
      remarks.length === 1 && (!this.hasSupport || this.hasCarbonOffset)
    const cb = api.tx.utility.batchAll

    const args = !this.hasSupport
      ? remarks.map(this.toRemark)
      : [
        ...remarks.map(this.toRemark),
        ...(await this.canSupport()),
        ...(await this.canOffset())
      ]

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
        query: { message: 'congrats' }
      })
    setTimeout(go, 2000)
  }
}
</script>
