<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <BaseCollectionForm v-bind.sync="base">
      <template v-slot:main>
        <b-field class="mb-5" />
      </template>
      <template v-slot:footer>
        <CustomAttributeInput
          :max="10"
          v-model="attributes"
          class="mb-3"
          visible="collapse.collection.attributes.show"
          hidden="collapse.collection.attributes.hide" />
        <b-field>
          <p class="has-text-weight-medium is-size-6 has-text-warning">
            {{ $t('mint.deposit') }}:
            <Money :value="collectionDeposit" inline />
          </p>
        </b-field>
        <SubmitButton
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
import {
  getclassDeposit,
  getMetadataDeposit,
} from '@/components/unique/apiConstants'
import { getRandomValues, hasEnoughToken } from '@/components/unique/utils'
import onApiConnect from '@/utils/api/general'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import { uploadDirect } from '@/utils/directUpload'
import formatBalance from '@/utils/formatBalance'
import { mapToId } from '@/utils/mappers'
import AuthMixin from '@/utils/mixins/authMixin'
import ChainMixin from '@/utils/mixins/chainMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import { pinFileToIPFS, pinJson, PinningKey } from '@/utils/pinning'
import resolveQueryPath from '@/utils/queryPathResolver'
import { estimate } from '@/utils/transactionExecutor'
import { unwrapSafe } from '@/utils/uniquery'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark'
import Connector from '@kodadot1/sub-api'
import { Component, mixins } from 'nuxt-property-decorator'
import { dummyIpfsCid } from '~/utils/ipfs'
import { pinImageSafe, getImageTypeSafe } from '@/utils/safePin'

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
  CustomAttributeInput: () =>
    import('@/components/rmrk/Create/CustomAttributeInput.vue'),
}

@Component({ components })
export default class CreateCollection extends mixins(
  MetaTransactionMixin,
  ChainMixin,
  AuthMixin,
  PrefixMixin
) {
  private base: BaseCollectionType = {
    name: '',
    file: null,
    description: '',
  }
  private hasSupport = true
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

    return unSanitizeIpfsUrl(metaHash)
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

  protected tryToEstimateTx(): Promise<string> {
    const { api } = Connector.getInstance()
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
      const { api } = Connector.getInstance()
      const cb = api.tx.nft.createClass
      const randomId = await this.generateNewCollectionId()

      const args = this.cretateArgs(randomId, metadata)

      if (this.base.file) {
        this.$consola.log('[UPLOADING FILE]')
        uploadDirect(this.base.file, this.accountId).catch(this.$consola.warn)
      }

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[Collection] Saved ${this.base.name} in block ${blockNumber}`,
          notificationTypes.success
        )
      })
    } catch (e: any) {
      showNotification(`[ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
