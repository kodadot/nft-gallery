<template>
  <span>
    <Loader v-model="isLoading" :status="status" />
    <b-button
      type="is-primary is-bordered-light share-button"
      icon-left="trash"
      :disabled="disabled"
      @click="submit">
    </b-button>
  </span>
</template>

<script lang="ts">
import collectionBurnableStats from '@/queries/subsquid/general/collectionBurnableStats.graphql'
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import UseApiMixin from '@/utils/mixins/useApiMixin'
import { notificationTypes, showNotification } from '@/utils/notification'

type BurnableStats = Record<'all' | 'owned' | 'NFT', { count: number } | any>

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class DestroyCollection extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  UseApiMixin
) {
  @Prop(String) public id!: string
  public disabled = true
  public nfts = []

  async fetch() {
    try {
      const { data } = await this.$apollo.query<BurnableStats>({
        client: this.client,
        query: collectionBurnableStats,
        variables: { id: this.id, owner: this.accountId },
      })

      this.nfts = data.NFT
      this.disabled = data.all.count - data.owned.count !== 0
    } catch (e) {
      this.$consola.error(e)
    }
  }

  public async submit() {
    const { id: collectionId, nfts } = this
    try {
      const api = await this.useApi()
      this.initTransactionLoader()
      const cb = api.tx.utility.batchAll

      // loop non burned nfts
      const burnNftArgs = nfts.map((nft: { id: string }) =>
        api.tx.nft.burn(collectionId, nft.id.split('-')[1])
      )
      const finalArgs = [
        ...burnNftArgs,
        api.tx.nft.destroyCollection(collectionId),
      ]

      await this.howAboutToExecute(
        this.accountId,
        cb,
        [finalArgs],
        (blockNumber) => {
          showNotification(
            `[COLLECTION::BYE] Since block ${blockNumber} collection ${collectionId} no loger exists`,
            notificationTypes.success
          )
        }
      )
    } catch (e: any) {
      showNotification(`[DESTROY::ERR] ${e}`, notificationTypes.warn)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
