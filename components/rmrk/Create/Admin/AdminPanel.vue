<template>
  <section>
    <br />
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-3">
      {{ $t('action.admin') }}
    </p>
    <NeoField>
      <Auth />
    </NeoField>

    <template v-if="accountId">
      <NeoField :label="$t('collection')">
        <b-select
          v-model="selectedCollection"
          placeholder="Select a collection"
          expanded>
          <option
            v-for="option in collections"
            :key="option.id"
            :value="option">
            {{ option.name }} {{ option.id }} ({{ option.available }})
          </option>
        </b-select>
      </NeoField>
    </template>
    <h6 v-if="selectedCollection" class="subtitle is-6">
      NFTs to process ({{ selectedCollection.available }} pieces)
    </h6>
    <NeoField v-if="!selectedCollection && !collections.length">
      <NoCollection label="helper.noCollections" />
    </NeoField>

    <template v-if="selectedCollection">
      <ActionSelector v-model="action" />
      <component
        :is="showMeta"
        v-if="showMeta"
        class="mb-4"
        @input="updateMeta" />

      <BasicSwitch v-model="listed" label="action.omitListed" />

      <NeoField>
        <PasswordInput v-model="password" :account="accountId" />
      </NeoField>
      <NeoField>
        <b-button
          type="is-primary"
          icon-left="paper-plane"
          :disabled="disabled"
          :loading="isLoading"
          outlined
          @click="sub">
          {{ $t('action.click', [action]) }}
        </b-button>
      </NeoField>
    </template>
  </section>
</template>

<script lang="ts">
import { AdminNFT, ProcessFunction } from '@/components/accounts/utils'
import collectionByAccountWithTokens from '@/queries/collectionByAccountWithTokens.graphql'
import ChainMixin from '@/utils/mixins/chainMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import RmrkVersionMixin from '@/utils/mixins/rmrkVersionMixin'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'
import TransactionMixin from '@/utils/mixins/txMixin'
import { notificationTypes, showNotification } from '@/utils/notification'
import shouldUpdate from '@/utils/shouldUpdate'
import exec, { execResultValue, txCb } from '@/utils/transactionExecutor'
import { Interaction, createInteraction } from '@kodadot1/minimark/v1'
import { mapAsSystemRemark } from '@kodadot1/minimark/common'
import { DispatchError } from '@polkadot/types/interfaces'
import { Component, Watch, mixins } from 'nuxt-property-decorator'
import UseApiMixin from '~/utils/mixins/useApiMixin'
import { NeoField } from '@kodadot1/brick'

type EmptyPromise = Promise<void>

type MintedCollection = {
  id: string
  name: string
  available: number
  max: number
  metadata: string
  symbol: string
  nfts: { id: string; price: string }[]
}

const needMeta: Record<string, string> = {
  SEND: 'SendHandler',
}

const components = {
  Auth: () => import('@/components/shared/Auth.vue'),
  PasswordInput: () => import('@/components/shared/PasswordInput.vue'),
  BalanceInput: () => import('@/components/shared/BalanceInput.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
  NoCollection: () => import('@/components/shared/wrapper/NoCollection.vue'),
  ActionSelector: () => import('./ActionSelector.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
  SendHandler: () => import('./SendHandler.vue'),
  NeoField,
}

@Component<AdminPanel>({
  components,
})
export default class AdminPanel extends mixins(
  SubscribeMixin,
  RmrkVersionMixin,
  TransactionMixin,
  ChainMixin,
  PrefixMixin,
  UseApiMixin
) {
  protected commands = ''
  private password = ''
  private action: Interaction.SEND | Interaction.CONSUME | Interaction.LIST =
    Interaction.CONSUME
  protected collections: MintedCollection[] = []
  private selectedCollection: MintedCollection | null = null
  private isMetaValid = false
  protected listed = true
  protected metaFunction: ProcessFunction | undefined = undefined

  public async fetchCollections(): EmptyPromise {
    const collections = await this.$apollo.query({
      query: collectionByAccountWithTokens,
      client: this.urlPrefix,
      variables: {
        account: this.accountId,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { collectionEntities },
    } = collections

    this.collections = collectionEntities.nodes
      ?.map((ce: any) => ({
        ...ce,
        available: ce.nfts?.totalCount,
        nfts: ce.nfts?.nodes?.map((n: AdminNFT) => n),
      }))
      .filter((ce: MintedCollection) => ce.available > 0)
  }

  @Watch('accountId', { immediate: true })
  hasAccount(value: string, oldVal: string): void {
    if (shouldUpdate(value, oldVal)) {
      this.fetchCollections()
    }
  }

  get accountId() {
    return this.$store.getters.getAuthAddress
  }

  get disabled(): boolean {
    return Boolean(this.showMeta && !this.isMetaValid)
  }

  private skipListed(nft: AdminNFT) {
    return this.listed ? Number(nft.price) === 0 : true
  }

  get showMeta() {
    return needMeta[this.action]
  }

  protected updateMeta(value: {
    metaFunction: ProcessFunction
    isValidMeta: boolean
  }): void {
    this.isMetaValid = value.isValidMeta
    this.metaFunction = value.metaFunction
  }

  protected async sub(): EmptyPromise {
    if (!this.selectedCollection) {
      throw ReferenceError('[MASS MINT] Unable to mint without collection')
    }

    this.isLoading = true

    this.initTransactionLoader()
    this.status = 'loader.ipfs'

    try {
      this.status = 'loader.sign'
      const api = await this.useApi()
      const toRemark = mapAsSystemRemark(api)

      const cb = api.tx.utility.batchAll

      const nfts = this.selectedCollection.nfts.filter(this.skipListed)
      // .map(nft => NFTUtils.createInteraction(this.action, this.version, nft.id, ''))

      const final =
        this.showMeta && this.metaFunction
          ? this.metaFunction(nfts, this.version)
          : nfts.map((nft) =>
              createInteraction(this.action, this.version, nft.id, '')
            )

      const args = final.map(toRemark)

      const tx = await exec(
        this.accountId,
        '',
        cb,
        [args],
        txCb(
          async (blockHash) => {
            execResultValue(tx)
            const header = await api.rpc.chain.getHeader(blockHash)
            const blockNumber = header.number.toString()

            showNotification(
              `[NFT] ${this.action} ${nfts.length} entries in block ${blockNumber}`,
              notificationTypes.success
            )

            this.isLoading = false
          },
          (dispatchError) => {
            execResultValue(tx)
            this.onTxError(dispatchError)
            this.isLoading = false
          },
          (res) => this.resolveStatus(res.status)
        )
      )
    } catch (e) {
      showNotification((e as Error).toString(), notificationTypes.warn)
      this.isLoading = false
    }
  }

  protected async onTxError(dispatchError: DispatchError): EmptyPromise {
    const api = await this.useApi()
    if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule)
      const { docs, name, section } = decoded
      showNotification(
        `[ERR] ${section}.${name}: ${docs.join(' ')}`,
        notificationTypes.warn
      )
    } else {
      showNotification(
        `[ERR] ${dispatchError.toString()}`,
        notificationTypes.warn
      )
    }

    this.isLoading = false
  }
}
</script>
