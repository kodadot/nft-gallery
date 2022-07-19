<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <OfferTable
      :offers="offers"
      :accountId="accountId"
      is-bsx-stats
      is-collection />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import offerListByCollectionId from '@/queries/subsquid/bsx/offerListByCollectionId.graphql'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
  StatsOverview: () => import('~/components/bsx/Offer/StatsOverview.vue'),
}

@Component({ components })
export default class CollectionOffers extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  SubscribeMixin
) {
  @Prop(String) public collectionId!: string
  protected offers: Offer[] = []
  protected total = 0

  fetch() {
    this.fetchOffers()
  }

  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
  }

  protected async fetchOffers() {
    if (!this.collectionId) {
      return
    }
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: offerListByCollectionId,
        variables: { collectionId: this.collectionId },
      })
      this.setResponse(data)
    } catch (e) {
      this.$consola.error(e)
    }
  }
}
</script>
