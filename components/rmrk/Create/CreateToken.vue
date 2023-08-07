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

        <NeoMessage
          v-if="hasPrice"
          key="message"
          type="is-primary"
          has-icon
          icon="exclamation-triangle">
          {{ $t('warning.newTransactionWhilePriceSet') }}
        </NeoMessage>

        <template v-if="version === '2.0.0'">
          <BasicSwitch
            key="hasRoyalty"
            v-model="hasRoyalty"
            label="mint.listWithRoyalty" />
          <RoyaltyForm v-if="hasRoyalty" key="royalty" v-bind.sync="royalty" />
        </template>
      </template>
      <template #footer>
        <NeoField key="advanced">
          <CollapseWrapper
            v-if="base.copies > 1"
            visible="mint.expert.show"
            hidden="mint.expert.hide"
            class="mt-3">
            <BasicSwitch
              v-model="postfix"
              class="mt-3"
              label="mint.expert.postfix" />
          </CollapseWrapper>
        </NeoField>
        <NeoField
          v-if="isLogIn"
          key="submit"
          variant="danger"
          :message="balanceNotEnoughMessage">
          <SubmitButton
            expanded
            label="mint.submit"
            :loading="isLoading"
            @click="submit()" />
        </NeoField>
      </template>
    </BaseTokenForm>
  </div>
</template>

<script lang="ts">
import { BaseTokenType } from '@/components/base/types'
import collectionForMint from '@/queries/subsquid/rmrk/collectionForMint.graphql'
import { Location } from 'vue-router/types/router'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import {
  notificationTypes,
  showNotification,
  warningMessage,
} from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { CreatedNFT, Interaction } from '@kodadot1/minimark/v1'
import { CreatedNFT as CreatedNFTV2 } from '@kodadot1/minimark/v2'
import { Attribute } from '@kodadot1/minimark/common'
import { formatBalance } from '@polkadot/util'
import { Component, Prop, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { unwrapSafe } from '@/utils/uniquery'
import { toNFTId } from '../service/scheme'
import { usePreferencesStore } from '@/stores/preferences'
import { Ref as RefType } from 'vue'
import { Royalty } from '@/utils/royalty'
import {
  MintedCollectionKusama,
  TokenToList,
} from '@/composables/transaction/types'
import { NeoField, NeoMessage } from '@kodadot1/brick'

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
  NeoMessage,
  NeoField,
}

@Component({ components })
export default class CreateToken extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  PrefixMixin,
  AuthMixin,
  UseApiMixin
) {
  public base: BaseTokenType<MintedCollectionKusama> = {
    name: '',
    file: null,
    description: '',
    selectedCollection: null,
    copies: 1,
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

  get version() {
    return useRmrkVersion().version.value
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
          copies: Number(this.base.copies),
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
        if (blockNumber.value && createdNFTs.value) {
          const isJustNftMint = !this.listed
          if (isJustNftMint) {
            setTimeout(
              () =>
                this.handleCreatedNftsRedirect(
                  createdNFTs.value,
                  blockNumber.value as string
                ),
              300
            )
          } else if (this.hasPrice) {
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

  public async listForSale(
    createdNFT: CreatedNFT[] | CreatedNFTV2[],
    originalBlockNumber: string
  ) {
    try {
      const { transaction, status, isLoading, blockNumber } = useTransaction()

      watch([isLoading, status], () => {
        this.isLoading = isLoading.value
        if (Boolean(status.value)) {
          this.status = status.value
        }
      })

      const balance = formatBalance(this.price, {
        decimals: this.decimals,
        withUnit: this.unit,
      })

      if (!createdNFT) {
        showNotification('Can not list empty NFTs', notificationTypes.warn)
        return
      }

      showNotification(`[💰] Listing NFT to sale for ${balance}`)
      const list: TokenToList[] = createdNFT.map((nft) => ({
        price: this.price.toString(),
        nftId: toNFTId(nft, originalBlockNumber),
      }))

      this.isLoading = true
      transaction({
        interaction: Interaction.LIST,
        urlPrefix: this.urlPrefix,
        token: list,

        successMessage: (blockNumber) =>
          `[💰] Listed ${this.base.name} for ${balance} in block ${blockNumber}`,
      })

      watch([isLoading, blockNumber], () => {
        if (!isLoading.value && blockNumber.value) {
          this.handleCreatedNftsRedirect(createdNFT, originalBlockNumber)
        }
      })
    } catch (e) {
      showNotification((e as Error).message, notificationTypes.warn)
    }
  }

  protected handleCreatedNftsRedirect(
    createdNFT: CreatedNFT[] | CreatedNFTV2[],
    originalBlockNumber: string
  ) {
    const nfts = createdNFT.map((nft) => toNFTId(nft, originalBlockNumber))

    const isSingle = nfts.length === 1

    this.navigateToDetail({
      pageId: isSingle ? nfts[0] : (this.base.selectedCollection?.id as string),
      nftName: this.base.name,
      toCollectionPage: !isSingle,
    })
  }

  protected async estimateTx() {
    // TODO: implement
  }

  protected navigateToDetail({
    pageId,
    nftName,
    toCollectionPage,
  }: {
    pageId: string
    nftName: string
    toCollectionPage: boolean
  }) {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const subPath = toCollectionPage ? 'collection' : 'gallery'
    const go = () => {
      const navigateTo: Location = {
        path: `/${this.urlPrefix}/${subPath}/${pageId}`,
      }
      if (!toCollectionPage) {
        navigateTo.query = { congratsNft: nftName }
      }
      return this.$router.push(navigateTo)
    }
    setTimeout(go, DETAIL_TIMEOUT)
  }
}
</script>
