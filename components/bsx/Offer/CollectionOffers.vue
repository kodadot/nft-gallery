<template>
  <div>
    <b-select v-model="selectedStatus">
      <option
        v-for="option in uniqType"
        :value="option.type"
        :key="option.type">
        {{ option.value }}
      </option>
    </b-select>
    <OfferTable
      :offers="showOffers"
      :accountId="accountId"
      is-bsx-stats
      is-collection />
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import offerListByCollectionId from '@/queries/subsquid/bsx/offerListByCollectionId.graphql'
import { AllOfferStatusType } from '~/utils/offerStatus'

const components = {
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
}

@Component({ components })
export default class CollectionOffers extends mixins(AuthMixin, PrefixMixin) {
  @Prop(String) public collectionId!: string
  protected offers: Offer[] = []
  protected showOffers: Offer[] = []
  protected status: AllOfferStatusType = AllOfferStatusType.ALL
  // protected uniqType = [{value: 'All', type: 'all'}, {value: 'Test', type: 'test'}]

  get uniqType(): { type: AllOfferStatusType; value: string }[] {
    const statusSet = new Set(this.offers.map((offer) => offer.status))
    const singleEventList = Array.from(statusSet).map((type) => ({
      type: type as AllOfferStatusType,
      value: AllOfferStatusType[type],
    }))
    return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
  }

  fetch() {
    this.fetchOffers()
  }

  get selectedStatus() {
    return this.status
  }

  set selectedStatus(value: AllOfferStatusType) {
    if (value === AllOfferStatusType.ALL) {
      this.showOffers = this.offers.concat()
    } else {
      this.showOffers = this.offers.filter((offer) => offer.status === value)
    }
    this.status = value
  }

  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
    console.log(response.offers)
    this.showOffers = this.offers.concat()
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
