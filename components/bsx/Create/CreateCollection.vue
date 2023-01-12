<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm ref="collectionForm" v-bind.sync="base">
      <template #main>
        <b-field class="mb-5" />
      </template>
      <template #footer>
        <!-- Hidden as of 11.July.2022 due to lack of convenience #3407 -->
        <!-- <CustomAttributeInput
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" /> -->
        <b-field>
          <p class="has-text-weight-medium is-size-6 has-text-info">
            {{ $t('mint.deposit') }}:
            <Money :value="collectionDeposit" :token-id="tokenId" inline />
          </p>
        </b-field>
        <b-field>
          <AccountBalance :token-id="tokenId" />
        </b-field>
        <b-field>
          <MultiPaymentFeeButton :account-id="accountId" :prefix="urlPrefix" />
        </b-field>
        <b-field type="is-danger" :message="balanceNotEnoughMessage">
          <SubmitButton
            label="create collection"
            :loading="isLoading"
            @click="submit" />
        </b-field>
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { Attribute } from '@/components/rmrk/types'
import {
  getMetadataDeposit,
  getclassDeposit,
} from '@/components/unique/apiConstants'
import { getRandomValues, hasEnoughToken } from '@/components/unique/utils'
import { uploadDirect } from '@/utils/directUpload'
import formatBalance from '@/utils/format/balance'
import { mapToId } from '@/utils/mappers'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import ApiUrlMixin from '@/utils/mixins/apiUrlMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { PinningKey, pinJson } from '@/services/nftStorage'
import resolveQueryPath from '@/utils/queryPathResolver'
import { getImageTypeSafe, pinImageSafe } from '@/utils/safePin'
import { estimate } from '@/utils/transactionExecutor'
import { unwrapSafe } from '@/utils/uniquery'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark'
import { Component, Ref, mixins } from 'nuxt-property-decorator'
import { ApiFactory, onApiConnect } from '@kodadot1/sub-api'
import { dummyIpfsCid } from '@/utils/ipfs'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

type BaseCollectionType = {
  name: string
  file: File | null
  description: string
}

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  BasicInput: () => import('@/components/shared/form/BasicInput.vue'),
  BaseCollectionForm: () => import('@/components/base/BaseCollectionForm.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SubmitButton: () => import('@/components/base/SubmitButton.vue'),
  Money: () => import('@/components/bsx/format/TokenMoney.vue'),
  AccountBalance: () => import('@/components/shared/AccountBalance.vue'),
  MultiPaymentFeeButton: () =>
    import('@/components/bsx/specific/MultiPaymentFeeButton.vue'),
}

@Component({ components })
export default class CreateCollection extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  AuthMixin,
  PrefixMixin,
  ApiUrlMixin
) {
  private base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  protected collectionDeposit = ''
  protected id = '0'
  protected attributes: Attribute[] = []
  protected balanceNotEnough = false
  @Ref('collectionForm') readonly collectionForm

  public checkValidity() {
    return this.collectionForm.checkValidity()
  }

  get balanceNotEnoughMessage() {
    if (this.balanceNotEnough) {
      return this.$t('tooltip.notEnoughBalance')
    }
    return ''
  }

  public async created() {
    onApiConnect(this.apiUrl, (api) => {
      const classDeposit = getclassDeposit(api)
      const metadataDeposit = getMetadataDeposit(api)
      this.collectionDeposit = (classDeposit + metadataDeposit).toString()
    })
  }

  public async constructMeta() {
    const { file, name, description } = this.base

    const pinningKey: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const imageHash = await pinImageSafe(file, pinningKey.token)
    const type = getImageTypeSafe(file)
    const attributes = this.attributes.map((val) => ({
      ...val,
      display_type: null,
    }))

    const meta = createMetadata(
      name,
      description,
      imageHash,
      undefined,
      attributes,
      undefined,
      type
    )
    const metaHash = await pinJson(meta, imageHash)

    if (file) {
      this.$consola.log('[UPLOADING FILE]')
      uploadDirect(file, imageHash).catch(this.$consola.warn)
    }

    return unSanitizeIpfsUrl(metaHash)
  }

  get tokenId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  protected async generateNewCollectionId(): Promise<number> {
    const randomNumbers = getRandomValues(10).map(String)
    const query = await resolveQueryPath(
      this.urlPrefix,
      'existingCollectionList'
    )
    const cols = this.$apollo.query({
      query: query.default,
      client: this.urlPrefix,
      variables: {
        ids: randomNumbers,
      },
    })
    const {
      data: { collectionEntities },
    } = await cols
    const collectionList = unwrapSafe(collectionEntities)
    const existingIds = collectionList.map(mapToId)
    const newId = randomNumbers.find((id) => !existingIds.includes(id))
    return Number(newId)
  }

  protected cretateArgs(
    randomId: number,
    metadata: string
  ): [number, { Marketplace: null }, string] {
    return [randomId, { Marketplace: null }, metadata]
  }

  protected async tryToEstimateTx(): Promise<string> {
    const api = await ApiFactory.useApiInstance(this.apiUrl)
    const cb = api.tx.utility.batchAll
    const metadata = dummyIpfsCid()
    const randomId = 0
    const args = [this.cretateArgs(randomId, metadata)]
    return estimate(this.accountId, cb, args)
  }

  protected async checkBalanceBeforeTx(): Promise<void> {
    const estimated = await this.tryToEstimateTx()
    const deposit = this.collectionDeposit
    const hasTokens = hasEnoughToken(this.balance, estimated, deposit)
    this.$consola.log('hasTokens', hasTokens)
    if (!hasTokens) {
      throw new Error(
        `Not enough tokens: Currently have ${formatBalance(
          this.balance,
          this.decimals,
          this.unit
        )} tokens`
      )
    }
  }

  protected async submit(): Promise<void> {
    // check fields
    if (!this.checkValidity()) {
      return
    }
    // check balance
    if (
      !!this.collectionDeposit &&
      parseFloat(this.balance) < parseFloat(this.collectionDeposit)
    ) {
      this.balanceNotEnough = true
      return
    }
    this.isLoading = true
    this.status = 'loader.checkBalance'

    try {
      // await this.checkBalanceBeforeTx()
      showNotification(
        `Creating collection ${this.base.name}`,
        notificationTypes.info
      )
      this.status = 'loader.ipfs'
      const metadata = await this.constructMeta()
      // const metadata = 'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
      const api = await ApiFactory.useApiInstance(this.apiUrl)
      const cb = api.tx.nft.createCollection
      const randomId = await this.generateNewCollectionId()

      const args = this.cretateArgs(randomId, metadata)

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[Collection] Saved ${this.base.name} in block ${blockNumber}`,
          notificationTypes.success
        )
        this.$emit('created')
      })
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
