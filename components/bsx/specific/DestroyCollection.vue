<template>
  <span>
    <Loader v-model="isLoading" :status="status" />
    <b-button
      type="is-primary is-bordered-light share-button"
      icon-left="trash"
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

type BurnableStats = Record<'all' | 'owned', { count: number }>

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class DonationButton extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  UseApiMixin
) {
  @Prop(String) public id!: string
  public disabled = true

  async fetch() {
    try {
      const { data } = await this.$apollo.query<BurnableStats>({
        client: this.client,
        query: collectionBurnableStats,
        variables: { id: this.id, owner: this.accountId },
      })

      console.log(data)

      this.disabled = data.all.count - data.owned.count !== 0
    } catch (e) {
      this.$consola.error(e)
    }
  }

  public async submit() {
    const { id: collectionId } = this
    try {
      const api = await this.useApi()
      this.initTransactionLoader()
      const cb = api.tx.utility.batchAll

      // loop
      const args = [collectionId]
      // api.tx.nft.burn(collectionId, non_burnedNftId1),
      // api.tx.nft.burn(collectionId, non_burnedNftId2),
      // api.tx.nft.burn(collectionId, non_burnedNftId3),
      // ...
      // api.tx.nft.destroyCollection(collectionId),

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[COLLECTION::BYE] Since block ${blockNumber} collection ${collectionId} no loger exists`,
          notificationTypes.success
        )
      })
    } catch (e: any) {
      showNotification(`[DESTROY::ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
