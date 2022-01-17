<template>
  <div>
    <div class="box">
      <Loader v-model="isLoading" :status="status" />
      <b-field>
        <Auth />
      </b-field>
      <template v-if="accountId">
        <b-field
          :label="$i18n.t('Collection')"
          :message="$t('Select collection where do you want mint your token')">
          <b-select
            placeholder="Select a collection"
            v-model="selectedCollection"
            expanded>
            <option disabled selected value="">--</option>
            <option
              v-for="option in collections"
              :value="option"
              :key="option.id">
              {{ option.name || option.id }} ({{ option.alreadyMinted }})
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
        :alreadyMinted="selectedCollection.alreadyMinted" />
      <b-field>
        <CollapseWrapper
          v-if="nft.edition > 1"
          visible="mint.expert.show"
          hidden="mint.expert.hide"
          class="mt-3">
          <BasicSwitch
            class="mt-3"
            v-model="postfix"
            label="mint.expert.postfix" />
        </CollapseWrapper>
      </b-field>
      <CustomAttributeInput
        v-show="selectedCollection"
        :max="5"
        v-model="attributes"
        class="mb-3"
        visible="collapse.collection.attributes.show"
        hidden="collapse.collection.attributes.hide" />
      <b-field>
        <PasswordInput v-model="password" :account="accountId" />
      </b-field>
      <b-field>
        <p class="has-text-weight-medium is-size-6 has-text-warning">
          {{ $t('mint.deposit') }}: <Money :value="deposit" inline />
        </p>
      </b-field>
      <b-field>
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          @click="submit"
          :disabled="disabled"
          :loading="isLoading"
          outlined>
          {{ $t('mint.submit') }}
        </b-button>
      </b-field>
      <b-field>
        <Support v-model="hasSupport" :price="filePrice" />
      </b-field>
      <b-field>
        <Support
          v-model="hasCarbonOffset"
          :price="1"
          activeMessage="I'm making carbonless NFT"
          passiveMessage="I don't want to have carbonless NFT" />
      </b-field>
      <ArweaveUploadSwitch v-model="arweaveUpload" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins, Vue } from 'nuxt-property-decorator'
import CreateItem from './CreateItem.vue'
import Tooltip from '@/components/shared/Tooltip.vue'
import Support from '@/components/shared/Support.vue'
import Connector from '@vue-polkadot/vue-api'
import exec, {
  execResultValue,
  txCb,
  estimate,
} from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import {
  NFT,
  NFTMetadata,
  MintNFT,
  getNftId,
} from '@/components/rmrk/service/scheme'
import { pinJson, getKey, revokeKey } from '@/utils/proxy'
import { unSanitizeIpfsUrl, ipfsToArweave } from '@/utils/ipfs'
import PasswordInput from '@/components/shared/PasswordInput.vue'
import NFTUtils, { basicUpdateFunction } from '../NftUtils'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { supportTx, MaybeFile, calculateCost, offsetTx } from '@/utils/support'
import collectionForMint from '@/queries/unique/collectionForMint.graphql'
import TransactionMixin from '@/utils/mixins/txMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/components/rmrk/Create/mintUtils'
import { formatBalance } from '@polkadot/util'
import { DispatchError } from '@polkadot/types/interfaces'
import { APIKeys, pinFileToIPFS } from '@/utils/pinata'
import { Attribute } from '@/components/rmrk/types'
import onApiConnect from '~/utils/api/general'
import {
  getclassDeposit,
  getInstanceDeposit,
  getMetadataDeposit,
} from '../apiConstants'
import {
  fetchCollectionMetadata,
  sanitizeIpfsUrl,
} from '~/components/rmrk/utils'
import { getMany, update } from 'idb-keyval'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { createTokenId, tokenIdToRoute } from '../utils'

interface NFTAndMeta extends NFT {
  meta: NFTMetadata
}

type MintedCollection = {
  id: string
  alreadyMinted: number
  metadata: string
  name?: string
  lastIndexUsed: number
}

@Component({
  components: {
    Auth: () => import('@/components/shared/Auth.vue'),
    CreateItem,
    PasswordInput,
    Tooltip,
    Support,
    Money: () => import('@/components/shared/format/Money.vue'),
    Loader: () => import('@/components/shared/Loader.vue'),
    ArweaveUploadSwitch: () =>
      import('@/components/rmrk/Create/ArweaveUploadSwitch.vue'),
    CollapseWrapper: () =>
      import('@/components/shared/collapse/CollapseWrapper.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    CustomAttributeInput: () =>
      import('@/components/rmrk/Create/CustomAttributeInput.vue'),
  },
})
export default class CreateToken extends mixins(
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin,
  PrefixMixin
) {
  protected nft: MintNFT = {
    name: '',
    description: '',
    edition: 1,
    tags: [],
    nsfw: false,
    price: 0,
    file: undefined,
    secondFile: undefined,
  }
  protected collections: MintedCollection[] = []
  private selectedCollection: MintedCollection | null = null

  private password = ''
  private alreadyMinted = 0
  private hasSupport = true
  private estimated = ''
  private hasCarbonOffset = true
  private filePrice = 0
  protected arweaveUpload = false
  protected postfix = true
  protected deposit = '0'
  protected depositPerByte = BigInt(0)
  protected attributes: Attribute[] = []

  get accountId() {
    return this.$store.getters.getAuthAddress
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

    this.collections = collectionEntities.nodes?.map((ce: any) => ({
      ...ce,
      alreadyMinted: ce.nfts?.totalCount,
      lastIndexUsed:
        Number(
          tokenIdToRoute(
            ce.nfts?.nodes
              ?.map(({ id }) => id)
              .sort()
              ?.reverse()[0] || '0-0'
          ).id
        ) || 0,
    }))

    this.loadCollectionMeta()
  }

  protected async loadCollectionMeta() {
    const storedMetadata = await getMany(
      this.collections.map(({ metadata }: any) => metadata)
    )

    storedMetadata.forEach(async (m, i) => {
      if (!m) {
        try {
          const meta = await fetchCollectionMetadata(this.collections[i])
          Vue.set(this.collections, i, {
            ...this.collections[i],
            ...meta,
          })
          update(this.collections[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      } else {
        Vue.set(this.collections, i, {
          ...this.collections[i],
          ...m,
        })
      }
    })
  }

  get disabled() {
    return !(this.nft.name && this.nft.file && this.selectedCollection)
  }

  @Watch('nft.file')
  @Watch('nft.secondFile')
  private calculatePrice() {
    this.filePrice = calculateCost(
      ([this.nft.file, this.nft.secondFile] as MaybeFile[]).filter(
        (a) => typeof a !== 'undefined'
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
          this.nft.secondFile as MaybeFile,
        ]),
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

  protected createApiCall() {
    const { api } = Connector.getInstance()
    if (this.nft.price || this.nft.edition > 1) {
      return api.tx.utility.batchAll
    }
    return api.tx.nft.mint
  }
  protected createApiParams(metadata: string) {
    const { api } = Connector.getInstance()
    const { id, alreadyMinted } = this.selectedCollection!
    const args = NFTUtils.createNFT(id, alreadyMinted, this.accountId)
    if (!this.nft.price) {
      return args
    }
    const calls = [api.tx.nft.mint(...args)]
    return [calls]
  }

  protected async submit(): Promise<void> {
    if (!this.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { api } = Connector.getInstance()
    const { id, alreadyMinted, lastIndexUsed } = this.selectedCollection
    try {
      const metadata = await this.constructMeta()
      // const metadata = 'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
      const cb = api.tx.utility.batchAll
      const nextId = Math.max(lastIndexUsed + 1, alreadyMinted)
      const create = api.tx.uniques.mint(id, nextId, this.accountId)
      // Option to freeze metadata
      const meta = api.tx.uniques.setMetadata(id, nextId, metadata, false)
      const attributes = this.attributes.map((a) =>
        api.tx.uniques.setAttribute(
          id,
          String(nextId),
          a.trait_type,
          String(a.value)
        )
      )
      //
      const args = [[create, meta, ...attributes]]

      const tx = await exec(
        this.accountId,
        '',
        cb,
        args,
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[NFT] Saved ${this.nft.name} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.navigateToDetail(id, String(alreadyMinted))

            this.isLoading = false
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
    if (!this.nft.file) {
      throw new ReferenceError('No file found!')
    }

    const meta: NFTMetadata = {
      name: this.nft.name,
      description: this.nft.description,
      attributes: [
        ...(this.nft?.tags || []),
        ...nsfwAttribute(this.nft.nsfw),
        ...offsetAttribute(this.hasCarbonOffset),
      ],
      external_url: 'https://nft.kodadot.xyz',
      type: this.nft.file.type,
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
