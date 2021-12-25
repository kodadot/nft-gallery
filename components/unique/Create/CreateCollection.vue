<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <div class="box">
      <p class="title is-size-3">
        {{ $t("context") }}
      </p>

      <b-field>
        <Auth />
      </b-field>

      <MetadataUpload
        v-model="image"
        label="Drop collection logo here or click to upload or simple paste image from clipboard. We support various media types (PNG, JPEG, GIF, SVG)"
        expanded
        preview
        accept="image/png, image/jpeg, image/gif, image/svg+xml, image/svg"
      />
      <BasicInput
        v-model="rmrkMint.name"
        :label="$t('mint.collection.name.label')"
        :message="$t('mint.collection.name.message')"
        :placeholder="$t('mint.collection.name.placeholder')"
        expanded
        spellcheck="true"
      />

      <b-field>
        <b-switch v-model="unlimited" :rounded="false">
          {{ $t("mint.unlimited") }}
        </b-switch>
      </b-field>
      <b-field v-if="!unlimited" class="mt-1" :label="$i18n.t('Maximum NFTs in collection')">
        <b-numberinput
          v-model="rmrkMint.max"
          placeholder="1 is minumum"
          :min="1"
        ></b-numberinput>
      </b-field>

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
        :label="$t('mint.collection.description.label')"
        :message="$t('mint.collection.description.message')"
        :placeholder="$t('mint.collection.description.placeholder')"
      />
      <CustomAttributeInput
        :max="5"
        v-model="attributes"
        class="mb-3"
        visible="collapse.collection.attributes.show"
        hidden="collapse.collection.attributes.hide"
      />
      <b-field>
        <PasswordInput v-model="password" :account="accountId" />
      </b-field>
      <b-field>
      <p class="has-text-weight-medium is-size-6 has-text-warning">
        {{ $t("mint.deposit") }}: <Money :value="collectionDeposit" inline />
      </p>
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
          {{ $t("create collection") }}
        </b-button>
      </b-field>
      <b-field>
        <Support v-model="hasSupport" :price="filePrice" />
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, mixins } from 'nuxt-property-decorator'
import { emptyObject } from '@/utils/empty'

import Connector from '@vue-polkadot/vue-api'
import exec, { execResultValue, txCb, Extrinsic, estimate } from '@/utils/transactionExecutor'
import { notificationTypes, showNotification } from '@/utils/notification'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import { Collection, CollectionMetadata } from '@/components/rmrk/service/scheme'
import { unSanitizeIpfsUrl } from '@/utils/ipfs'
import { pinJson, pinFileDirect } from '@/utils/proxy'
import { decodeAddress } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { generateId } from '@/components/rmrk/service/Consolidator'
import { supportTx, calculateCost } from '@/utils/support'
import TransactionMixin from '@/utils/mixins/txMixin'
import existingCollectionList from '@/queries/unique/existingCollectionList.graphql'
import { Attribute } from '@/components/rmrk/types'
import { getRandomValues, hasEnoughToken } from '../utils'
import Query from '@/utils/api/Query'
import formatBalance from '@/utils/formatBalance'
import ChainMixin from '~/utils/mixins/chainMixin'
import onApiConnect from '@/utils/api/general'
import { getclassDeposit, getMetadataDeposit } from '../apiConstants'

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  MetadataUpload: () => import('@/components/rmrk/Create/DropUpload.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  Tooltip: () => import('@/components/shared/Tooltip.vue'),
  Support: () => import('@/components/shared/Support.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  CustomAttributeInput: () => import('@/components/rmrk/Create/CustomAttributeInput.vue')
}

@Component({ components })
export default class CreateCollection extends mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin
) {
  private rmrkMint: Collection = emptyObject<Collection>()
  private meta: CollectionMetadata = emptyObject<CollectionMetadata>()
  // private accountId: string = '';
  private uploadMode = true
  private image: Blob | null = null
  private password = ''
  private hasSupport = true
  protected unlimited = true
  protected collectionDeposit = ''
  protected id = '0'
  protected attributes: Attribute[] = []

  public async created() {
    onApiConnect(() => {
      const classDeposit = getclassDeposit()
      const metadataDeposit = getMetadataDeposit()
      this.collectionDeposit = (classDeposit + metadataDeposit).toString()
    })
  }

  get accountId() {
    return this.$store.getters.getAuthAddress
  }

  get rmrkId(): string {
    return generateId(this.accountId, this.rmrkMint?.symbol || '')
  }

  get accountIdToPubKey() {
    return (this.accountId && u8aToHex(decodeAddress(this.accountId))) || ''
  }

  get disabled(): boolean {
    const { name, symbol, max } = this.rmrkMint
    return !(name && symbol && (this.unlimited || max) && this.accountId && this.image)
  }

  get filePrice() {
    return calculateCost(this.image)
  }

  public async constructMeta() {
    if (!this.image) {
      throw new ReferenceError('No file found!')
    }

    this.meta = {
      ...this.meta,
      attributes: [],
      external_url: 'https://nft.kodadot.xyz'
    }

    // TODO: upload image to IPFS
    const imageHash = await pinFileDirect(this.image)
    this.meta.image = unSanitizeIpfsUrl(imageHash)
    // TODO: upload meta to IPFS
    const metaHash = await pinJson(this.meta)

    return unSanitizeIpfsUrl(metaHash)
  }

  protected async canSupport() {
    if (this.hasSupport && this.image) {
      return [await supportTx(this.image)]
    }

    return []
  }

  protected async generateNewCollectionId(): Promise<number> {
    const randomNumbers = getRandomValues(10).map(String)
    const cols = this.$apollo.query({
      query: existingCollectionList,
      variables: {
        ids: randomNumbers.map(String)
      },
    })
    const {
      data: {
        collectionEntities: {
          nodes: collectionList
        }
      }
    } = await cols
    const existingIds = collectionList.map(({ id }: {id: string}) => id)
    const newId = randomNumbers.find((id) => !existingIds.includes(id))
    return Number(newId)
  }

  protected cretateArgs(randomId: number, metadata: string): Extrinsic[] {
    const { api } = Connector.getInstance()
    const create = api.tx.uniques.create(randomId, this.accountId)
    // Option to freeze metadata
    const meta = api.tx.uniques.setClassMetadata(randomId, metadata, false)
    const attributes = this.attributes.map(a =>
      api.tx.uniques.setAttribute(randomId, null, a.trait_type, String(a.value)))

    return [create, meta, ...attributes]
  }

  protected tryToEstimateTx(): Promise<string> {
    const { api } = Connector.getInstance()
    const cb = api.tx.utility.batchAll
    const metadata = 'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
    const randomId = 0
    const args = [this.cretateArgs(randomId, metadata)]
    return estimate(this.accountId, cb, args)
  }

  protected async checkBalanceBeforeTx(): Promise<void> {
    const { api } = Connector.getInstance()
    const balance = await Query.getTokenBalance(api, this.accountId)
    const estimated = await this.tryToEstimateTx()
    const deposit = this.collectionDeposit
    const hasTokens = hasEnoughToken(balance, estimated, deposit)
    console.log('hasTokens', hasTokens)
    if (!hasEnoughToken(balance, estimated, deposit)) {
      throw new Error(`Not enough tokens: Currently have ${formatBalance(balance, this.decimals, this.unit)} tokens`)
    }
  }

  protected async submit(): Promise<void> {
    this.isLoading = true
    this.status = 'loader.checkBalance'

    try {
      await this.checkBalanceBeforeTx()
      showNotification(`Creating Collection: ${this.rmrkMint.name}`)
      this.status = 'loader.ipfs'
      const metadata = await this.constructMeta()
      // const metadata = 'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
      const { api } = Connector.getInstance()
      const cb = api.tx.utility.batchAll
      const randomId = await this.generateNewCollectionId()

      // TODO: enable can support
      const args = [this.cretateArgs(randomId, metadata)]
      // const args = !this.hasSupport
      //   ? mintString
      //   : [this.toRemark(mintString), ...(await this.canSupport())]

      const tx = await exec(
        this.accountId,
        '',
        cb,
        args,
        txCb(
          async blockHash => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[Collection] Saved ${this.rmrkMint.name} in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
          },
          dispatchError => {
            execResultValue(tx)
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              )
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
          },
          res => this.resolveStatus(res.status)
        )
      )
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      console.error(e)
      this.isLoading = false
    }
  }
}
</script>
