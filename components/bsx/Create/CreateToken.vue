<template>
  <div>
    <Loader v-model="isLoading" :status="status" :can-cancel="false" />
    <BaseTokenForm
      ref="baseTokenForm"
      :show-explainer-text="showExplainerText"
      v-bind.sync="base"
      :collections="collections"
      :has-edition="false">
      <template #main>
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BasicSwitch key="listed" v-model="listed" label="mint.listForSale" />
        <TokenBalanceInput
          v-if="listed"
          ref="balanceInput"
          key="token-price"
          v-model="price"
          :token-id="tokenId"
          :prefix="urlPrefix"
          class="mb-3" />

        <div v-show="base.selectedCollection" key="attributes">
          <CustomAttributeInput
            v-model="attributes"
            :prefix-attributes="carbonLessAttribute"
            :max="10"
            class="mb-3"
            visible="collapse.collection.attributes.show"
            hidden="collapse.collection.attributes.hide" />
        </div>
        <RoyaltyForm key="royalty" v-bind.sync="royalty" />
      </template>
      <template #footer>
        <b-field key="advanced">
          <CollapseWrapper
            v-if="base.edition > 1"
            visible="mint.expert.show"
            hidden="mint.expert.hide"
            class="mt-3">
            <BasicSwitch
              v-model="postfix"
              class="mt-3"
              label="mint.expert.postfix" />
          </CollapseWrapper>
        </b-field>
        <b-field key="deposit">
          <p class="has-text-weight-medium is-size-6 has-text-info">
            {{ $t('mint.deposit') }}:
            <Money :value="deposit" :token-id="tokenId" inline />
          </p>
        </b-field>
        <b-field key="balance">
          <AccountBalance :token-id="tokenId" />
        </b-field>
        <b-field key="token">
          <MultiPaymentFeeButton :account-id="accountId" :prefix="urlPrefix" />
        </b-field>
        <b-field
          key="submit"
          type="is-danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            label="mint.submit"
            :loading="isLoading"
            @click="submit()" />
        </b-field>
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
import { PinningKey, pinFileToIPFS, pinJson } from '@/services/nftStorage'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  Attribute,
  createMetadata,
  unSanitizeIpfsUrl,
} from '@kodadot1/minimark'

import { ApiFactory, onApiConnect } from '@kodadot1/sub-api'
import { Component, Prop, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import {
  getInstanceDeposit,
  getMetadataDeposit,
} from '@/components/unique/apiConstants'
import { createTokenId } from '@/components/unique/utils'
import {
  DETAIL_TIMEOUT,
  IPFS_KODADOT_IMAGE_PLACEHOLDER,
} from '@/utils/constants'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'
import { Royalty, isRoyaltyValid } from '@/utils/royalty'
import {
  fetchCollectionMetadata,
  preheatFileFromIPFS,
} from '~/components/rmrk/utils'
import { getMany, update } from 'idb-keyval'
import ApiUrlMixin from '~/utils/mixins/apiUrlMixin'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

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
  RoyaltyForm: () => import('@/components/bsx/Create/RoyaltyForm.vue'),
  Money: () => import('@/components/bsx/format/TokenMoney.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  MultiPaymentFeeButton: () =>
    import('@/components/bsx/specific/MultiPaymentFeeButton.vue'),
  TokenBalanceInput: () =>
    import('@/components/bsx/input/TokenBalanceInput.vue'),
}

@Component({ components })
export default class CreateToken extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  PrefixMixin,
  AuthMixin,
  ApiUrlMixin
) {
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean

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
  protected price = '0'
  protected listed = true
  protected royalty: Royalty = {
    amount: 0.15,
    address: '',
  }
  protected metadata = ''
  protected balanceNotEnough = false
  @Ref('balanceInput') readonly balanceInput
  @Ref('baseTokenForm') readonly baseTokenForm

  @Watch('price')
  protected updatePrice(value: string) {
    this.price = value
    this.balanceInput.checkValidity()
  }

  get hasPrice() {
    return Number(this.price)
  }

  get balanceNotEnoughMessage() {
    if (this.balanceNotEnough) {
      return this.$t('tooltip.notEnoughBalance')
    }
    return ''
  }

  public async created() {
    onApiConnect(this.apiUrl, (api) => {
      const instanceDeposit = getInstanceDeposit(api)
      const metadataDeposit = getMetadataDeposit(api)
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
      totalCount: ce.nfts?.filter((nft) => !nft.burned).length,
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
          this.$set(this.collections, i, {
            ...this.collections[i],
            ...meta,
          })
          update(this.collections[i].metadata, () => meta)
        } catch (e) {
          this.$consola.warn('[ERR] unable to get metadata')
        }
      } else {
        this.$set(this.collections, i, {
          ...this.collections[i],
          ...m,
        })
      }
    })
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

  get validPriceValue(): boolean {
    const price = parseInt(this.price as string)
    return !this.listed || price > 0
  }

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  get carbonLessAttribute(): Attribute[] {
    return offsetAttribute(this.hasCarbonOffset)
  }

  public checkValidity() {
    const balanceInputValid = !this.listed || this.balanceInput?.checkValidity()
    const baseTokenFormValid = this.baseTokenForm?.checkValidity()
    return balanceInputValid && baseTokenFormValid
  }

  protected async submit(retryCount = 0): Promise<void> {
    if (!this.base.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }
    // check fields
    if (!this.checkValidity()) {
      return
    }
    // check balance
    if (!!this.deposit && parseFloat(this.balance) < parseFloat(this.deposit)) {
      this.balanceNotEnough = true
      return
    }
    this.isLoading = true
    this.status = 'loader.ipfs'
    const api = await ApiFactory.useApiInstance(this.apiUrl)
    const { selectedCollection } = this.base
    const {
      alreadyMinted,
      id: collectionId,
      lastIndexUsed,
    } = selectedCollection

    try {
      const metadata =
        retryCount && this.metadata ? this.metadata : await this.constructMeta()

      const cb = api.tx.utility.batchAll
      const nextId = Math.max(lastIndexUsed + 1, alreadyMinted + 1)
      const create = api.tx.nft.mint(collectionId, nextId, metadata)
      const list = this.price
        ? [api.tx.marketplace.setPrice(collectionId, nextId, this.price)]
        : []

      const addRoyalty = isRoyaltyValid(this.royalty)
        ? [
            api.tx.marketplace.addRoyalty(
              collectionId,
              nextId,
              this.royalty.address,
              this.royalty.amount * 100
            ),
          ]
        : []

      const args = [[create, ...list, ...addRoyalty]]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[NFT] Saved ${this.base.name} in block ${blockNumber}`,
          notificationTypes.success
        )

        this.navigateToDetail(collectionId, String(nextId))
        this.stopLoader()
      })
    } catch (e) {
      if (e instanceof Error) {
        this.stopLoader()

        if (retryCount < 3) {
          // retry
          showNotification('Retrying to complete minting process.')
          this.submit(retryCount + 1)
        } else {
          // finally fail
          showNotification(e.toString(), notificationTypes.danger)
        }
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

    preheatFileFromIPFS(fileHash)
    // uploadDirect(file, this.accountId).catch(this.$consola.warn)
    const metaHash = await pinJson(meta, imageHash)
    const metadata = unSanitizeIpfsUrl(metaHash)
    this.metadata = metadata

    return metadata
  }

  protected navigateToDetail(collection: string, id: string): void {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const go = () =>
      this.$router.push({
        path: `/${this.urlPrefix}/gallery/${createTokenId(collection, id)}`,
        query: { message: 'congrats' },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }
}
</script>
