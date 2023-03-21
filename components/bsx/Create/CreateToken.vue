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
            :max="10"
            class="mb-3"
            visible="collapse.collection.attributes.show"
            hidden="collapse.collection.attributes.hide" />
        </div>

        <BasicSwitch
          key="hasRoyalty"
          v-model="hasRoyalty"
          label="mint.listWithRoyalty" />
        <RoyaltyForm v-if="hasRoyalty" key="royalty" v-bind.sync="royalty" />
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
import { offsetAttribute } from '@/utils/mintUtils'
import ChainMixin from '@/utils/mixins/chainMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import { Attribute, Interaction } from '@kodadot1/minimark'

import { onApiConnect } from '@kodadot1/sub-api'
import { Component, Prop, Ref, Watch, mixins } from 'nuxt-property-decorator'
import { BaseTokenType } from '@/components/base/types'
import {
  getInstanceDeposit,
  getMetadataDeposit,
} from '@/components/unique/apiConstants'
import { createTokenId } from '@/components/unique/utils'
import { DETAIL_TIMEOUT } from '@/utils/constants'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import resolveQueryPath from '@/utils/queryPathResolver'
import { unwrapSafe } from '@/utils/uniquery'
import { Royalty } from '@/utils/royalty'
import { fetchCollectionMetadata } from '@/utils/ipfs'
import ApiUrlMixin from '@/utils/mixins/apiUrlMixin'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { usePinningStore } from '@/stores/pinning'
import { usePreferencesStore } from '@/stores/preferences'
import { MintedCollectionBasilisk } from '~~/composables/transaction/types'

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
  private preferencesStore = usePreferencesStore()

  public base: BaseTokenType<MintedCollectionBasilisk> = {
    name: '',
    file: null,
    description: '',
    selectedCollection: null,
    edition: 1,
    secondFile: null,
  }
  public collections: MintedCollectionBasilisk[] = []
  public postfix = true
  public deposit = '0'
  public attributes: Attribute[] = []
  public nsfw = false
  public price = '0'
  public listed = false
  public hasRoyalty = true
  public royalty: Royalty = {
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

  get balanceNotEnoughMessage() {
    if (this.balanceNotEnough) {
      return this.$t('tooltip.notEnoughBalance')
    }
    return ''
  }

  get pinningStore() {
    return usePinningStore()
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
    const metadata = this.collections.map(({ metadata }) => metadata)

    metadata.forEach(async (m, i) => {
      try {
        const meta = await fetchCollectionMetadata(this.collections[i])
        this.$set(this.collections, i, {
          ...this.collections[i],
          ...meta,
        })
      } catch (e) {
        this.$consola.warn('[ERR] unable to get metadata')
      }
    })
  }

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  public checkValidity() {
    const balanceInputValid = !this.listed || this.balanceInput?.checkValidity()
    const baseTokenFormValid = this.baseTokenForm?.checkValidity()
    return balanceInputValid && baseTokenFormValid
  }

  public async submit(retryCount = 0): Promise<void> {
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
    const {
      alreadyMinted,
      id: collectionId,
      lastIndexUsed,
    } = this.base.selectedCollection
    const nextId = Math.max(lastIndexUsed + 1, alreadyMinted + 1)

    const { transaction, status, isLoading, blockNumber } = useTransaction()
    watch([isLoading, status], () => {
      this.isLoading = isLoading.value
      if (Boolean(status.value)) {
        this.status = status.value
      }
    })
    watch(blockNumber, (block) => {
      if (block) {
        this.navigateToDetail(collectionId, String(nextId))
      }
    })

    try {
      transaction({
        interaction: Interaction.MINTNFT,
        urlPrefix: usePrefix().urlPrefix.value,
        token: {
          ...this.base,
          nsfw: this.nsfw,
          price: this.price,
          postfix: this.postfix,
          tags: this.attributes,
        },
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

  protected navigateToDetail(collection: string, id: string): void {
    showNotification(
      `You will go to the detail in ${DETAIL_TIMEOUT / 1000} seconds`
    )
    const go = () =>
      this.$router.push({
        path: `/${this.urlPrefix}/gallery/${createTokenId(collection, id)}`,
        query: { congratsNft: this.base.name },
      })
    setTimeout(go, DETAIL_TIMEOUT)
  }
}
</script>
