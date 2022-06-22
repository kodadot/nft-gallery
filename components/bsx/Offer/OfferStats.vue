<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-4 has-text-success"></p>
    <OfferTable :offers="offers" :accountId="accountId" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import offersList from '@/queries/subsquid/bsx/offersList.graphql'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
}

@Component({ components })
export default class OfferList extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  SubscribeMixin
) {
  protected offers: Offer[] = []
  protected total = 0

  fetch() {
    this.fetchOffers()
  }

  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
    this.total = response.stats.total
  }

  protected async fetchOffers() {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: offersList,
      })
      console.log(data)
      this.setResponse(data)
    } catch (e) {
      this.$consola.error(e)
    }
  }
}
</script>
