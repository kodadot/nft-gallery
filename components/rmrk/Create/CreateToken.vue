<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseTokenForm
      v-bind.sync="base"
      ref="baseTokenForm"
      :collections="collections"
      :show-explainer-text="showExplainerText">
      <template #main>
        <BasicSwitch key="nsfw" v-model="nsfw" label="mint.nfsw" />
        <BasicSwitch key="listed" v-model="listed" label="mint.listForSale" />

        <BalanceInput
          v-if="listed"
          ref="balanceInput"
          key="price"
          label="Price"
          expanded
          required
          :has-to-larger-than-zero="listed"
          :step="0.1"
          class="mb-3"
          @input="updatePrice" />

        <div v-show="base.selectedCollection" key="attributes">
          <CustomAttributeInput
            v-model="tags"
            :max="10"
            class="mb-3"
            visible="collapse.collection.attributes.show"
            hidden="collapse.collection.attributes.hide" />
        </div>

        <b-message
          v-if="hasPrice"
          key="message"
          type="is-primary"
          has-icon
          icon="exclamation-triangle">
          {{ $t('warning.newTransactionWhilePriceSet') }}
        </b-message>

        <template v-if="version === '2.0.0'">
          <BasicSwitch
            key="hasRoyalty"
            v-model="hasRoyalty"
            label="mint.listWithRoyalty" />
          <RoyaltyForm v-if="hasRoyalty" key="royalty" v-bind.sync="royalty" />
        </template>
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
        <b-field
          v-if="isLogIn"
          key="submit"
          type="is-danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="mint.submit"
            :loading="isLoading"
            @click="submit()" />
        </b-field>
      </template>
    </BaseTokenForm>
  </div>
</template>

<script lang="ts">
import { BaseMintedCollection, BaseTokenType } from '@/components/base/types'
import collectionForMint from '@/queries/subsquid/rmrk/collectionForMint.graphql'

import { DETAIL_TIMEOUT } from '@/utils/constants'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import {
  notificationTypes,
  showNotification,
  warningMessage,
} from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import {
  CreatedNFT,
  Interaction,
  createInteraction,
} from '@kodadot1/minimark/v1'
import { Attribute, asSystemRemark } from '@kodadot1/minimark/common'
import { formatBalance } from '@polkadot/util'
import { Component, Prop, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { unwrapSafe } from '@/utils/uniquery'
import { toNFTId } from '../service/scheme'
import { usePreferencesStore } from '@/stores/preferences'
import { Ref as RefType } from 'vue'
import { MintedCollectionKusama } from '@/composables/transaction/types'
import { Royalty } from '@/utils/royalty'

const components = {
  AttributeTagInput: () =>
    import('@/components/rmrk/Create/AttributeTagInput.vue'),
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
  RoyaltyForm: () => import('@/components/bsx/Create/RoyaltyForm.vue'),
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
  public base: BaseTokenType<BaseMintedCollection> = {
    name: '',
    file: null,
    description: '',
    selectedCollection: null,
    edition: 1,
    secondFile: null,
  }

  public collections: MintedCollectionKusama[] = []
  public tags: Attribute[] = []
  public price: string | number = 0
  public nsfw = false
  public listed = true
  public postfix = true
  public balanceNotEnough = false

  public hasRoyalty = true
  public royalty: Royalty = {
    amount: 0.15,
    address: '',
  }

  private preferencesStore = usePreferencesStore()

  @Ref('balanceInput') readonly balanceInput
  @Ref('baseTokenForm') readonly baseTokenForm
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean

  public updatePrice(value: string) {
    this.price = value
  }

  get hasPrice() {
    return Number(this.price)
  }

  get balanceNotEnoughMessage() {
    return this.balanceNotEnough ? this.$t('tooltip.notEnoughBalance') : ''
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
        (ce: MintedCollectionKusama) =>
          (ce.max || Infinity) - ce.alreadyMinted > 0
      )
  }

  public checkValidity() {
    const balanceInputValid = !this.listed || this.balanceInput.checkValidity()
    const baseTokenFormValid = this.baseTokenForm.checkValidity()
    return balanceInputValid && baseTokenFormValid
  }

  get arweaveUpload(): boolean {
    return this.preferencesStore.arweaveUpload
  }

  public async submit() {
    if (!this.base.selectedCollection) {
      throw ReferenceError('[MINT] Unable to mint without collection')
    }

    if (!this.checkValidity()) {
      return
    }

    if (parseFloat(this.balance) === 0) {
      this.balanceNotEnough = true
      return
    }

    this.isLoading = true
    this.status = 'loader.ipfs'
    const { urlPrefix } = usePrefix()
    const { transaction, status, isLoading, blockNumber } = useTransaction()

    watch([isLoading, status], () => {
      this.isLoading = isLoading.value
      if (Boolean(status.value)) {
        this.status = status.value
      }
    })

    try {
      const { createdNFTs } = (await transaction({
        interaction: Interaction.MINTNFT,
        urlPrefix: urlPrefix.value,
        token: {
          ...this.base,
          tags: this.tags,
          nsfw: this.nsfw,
          postfix: this.postfix,
          price: this.price.toString(),
          royalty: this.royalty,
          hasRoyalty: this.hasRoyalty,
        },
      })) as {
        createdNFTs: RefType<CreatedNFT[]>
      }

      watch([blockNumber, createdNFTs], () => {
        if (this.hasPrice) {
          if (blockNumber.value && createdNFTs.value) {
            setTimeout(
              () =>
                this.listForSale(
                  createdNFTs.value,
                  blockNumber.value as string
                ),
              300
            )
          }
        }
      })
    } catch (e) {
      if (e instanceof Error) {
        warningMessage(e)
      }
    }
  }

  public async listForSale(remarks: CreatedNFT[], originalBlockNumber: string) {
    try {
      const api = await this.useApi()

      const { price } = this
      const balance = formatBalance(price, {
        decimals: this.decimals,
        withUnit: this.unit,
      })
      showNotification(`[💰] Listing NFT to sale for ${balance}`)

      const onlyNfts = remarks
        .map((nft) => toNFTId(nft, originalBlockNumber))
        .map((id) => createInteraction(Interaction.LIST, id, String(price)))

      if (!onlyNfts.length) {
        showNotification('Can not list empty NFTs', notificationTypes.warn)
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
      showNotification((e as Error).message, notificationTypes.warn)
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
        path: `/rmrk/gallery/${toNFTId(nft, blockNumber)}`,
        query: { congratsNft: nft.name },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }
}
</script>
