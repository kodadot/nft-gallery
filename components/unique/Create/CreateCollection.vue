<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm v-bind.sync="base">
      <template #footer>
        <!-- Hidden as of 11.July.2022 due to lack of convenience #3407 -->
        <!-- <CustomAttributeInput
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" /> -->
        <b-field>
          <p class="has-text-weight-medium is-size-6 has-text-warning">
            {{ $t('mint.deposit') }}:
            <Money :value="collectionDeposit" inline />
          </p>
        </b-field>
        <SubmitButton
          expanded
          label="create collection"
          :disabled="disabled"
          :loading="isLoading"
          @click="submit" />
      </template>
    </BaseCollectionForm>
  </div>
</template>

<script lang="ts">
import { Attribute } from '@/components/rmrk/types'
import existingCollectionList from '@/queries/unique/existingCollectionList.graphql'
import formatBalance from '@/utils/format/balance'
import { unSanitizeIpfsUrl } from '@kodadot1/minimark'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { PinningKey, pinFileToIPFS, pinJson } from '@/services/nftStorage'
import { canSupport } from '@/utils/support'
import { Extrinsic, estimate } from '@/utils/transactionExecutor'
import { createMetadata } from '@kodadot1/minimark'
import { Component, mixins } from 'nuxt-property-decorator'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import ChainMixin from '@/utils/mixins/chainMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { getMetadataDeposit, getclassDeposit } from '../apiConstants'
import { getRandomValues, hasEnoughToken } from '../utils'
import { uploadDirect } from '@/utils/directUpload'
import UseApiMixin from '~/utils/mixins/useApiMixin'
import { onApiConnect } from '@kodadot1/sub-api'

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
  Money: () => import('@/components/shared/format/Money.vue'),
  // CustomAttributeInput: () =>
  //   import('@/components/rmrk/Create/CustomAttributeInput.vue'),
}

@Component({ components })
export default class CreateCollection extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  AuthMixin,
  PrefixMixin,
  UseApiMixin
) {
  public base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  public collectionDeposit = ''
  protected id = '0'
  protected attributes: Attribute[] = []
  private hasSupport = true

  public async created() {
    onApiConnect(this.apiUrl, (api) => {
      const classDeposit = getclassDeposit(api)
      const metadataDeposit = getMetadataDeposit(api)
      this.collectionDeposit = (classDeposit + metadataDeposit).toString()
    })
  }

  get disabled(): boolean {
    const {
      base: { name },
      accountId,
    } = this
    return !(name && accountId)
  }

  get balance(): string {
    return this.$store.getters.getAuthBalance
  }

  public async constructMeta() {
    const { file, name, description } = this.base

    const pinningKey: PinningKey = await this.$store.dispatch(
      'pinning/fetchPinningKey',
      this.accountId
    )

    const imageHash = !file
      ? IPFS_KODADOT_IMAGE_PLACEHOLDER
      : await pinFileToIPFS(file, pinningKey.token)
    const type = !file ? 'image/png' : file.type
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

  protected async generateNewCollectionId(): Promise<number> {
    const randomNumbers = getRandomValues(10).map(String)
    const cols = this.$apollo.query({
      query: existingCollectionList,
      client: this.urlPrefix,
      variables: {
        ids: randomNumbers.map(String),
      },
    })
    const {
      data: {
        collectionEntities: { nodes: collectionList },
      },
    } = await cols
    const existingIds = collectionList.map(({ id }: { id: string }) => id)
    const newId = randomNumbers.find((id) => !existingIds.includes(id))
    return Number(newId)
  }

  protected async cretateArgs(
    randomId: number,
    metadata: string
  ): Promise<Extrinsic[]> {
    const api = await this.useApi()
    const create = api.tx.uniques.create(randomId, this.accountId)
    // Option to freeze metadata
    const meta = api.tx.uniques.setClassMetadata(randomId, metadata, false)
    const attributes = this.attributes.map((a) =>
      api.tx.uniques.setAttribute(randomId, null, a.trait_type, String(a.value))
    )

    return [create, meta, ...attributes]
  }

  protected async tryToEstimateTx(): Promise<string> {
    const api = await this.useApi()
    const cb = api.tx.utility.batchAll
    const metadata =
      'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
    const randomId = 0
    const args = [await this.cretateArgs(randomId, metadata)]
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

  public async submit(): Promise<void> {
    this.isLoading = true
    this.status = 'loader.checkBalance'

    try {
      await this.checkBalanceBeforeTx()
      showNotification(
        `Creating collection ${this.base.name}`,
        notificationTypes.info
      )
      this.status = 'loader.ipfs'
      const metadata = await this.constructMeta()
      // const metadata = 'ipfs://ipfs/QmaCWgK91teVsQuwLDt56m2xaUfBCCJLeCsPeJyHEenoES'
      const api = await this.useApi()
      const cb = api.tx.utility.batchAll
      const randomId = await this.generateNewCollectionId()

      const args = [
        await this.cretateArgs(randomId, metadata),
        ...(await canSupport(api, this.hasSupport)),
      ]

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
