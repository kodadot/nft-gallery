<template>
  <CollapseCardWrapper :label="$t('nft.offer.label', [total])">
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-4 has-text-success" v-if="total">
      {{ $t('nft.offer.count', [total]) }}
    </p>
    <OfferTable
      :offers="offers"
      @select="onOfferSelected"
      :accountId="accountId"
      :isOwner="isOwner" />
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { isSameAccount } from '~/utils/account'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { createTokenId } from '~/components/unique/utils'
import offerListByNftId from '@/queries/subsquid/bsx/offerListByNftId.graphql'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'
import OfferSubmitMixin from '~/utils/mixins/offerSubmitMixin'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
}

@Component({ components })
export default class OfferList extends mixins(
  PrefixMixin,
  SubscribeMixin,
  OfferSubmitMixin
) {
  protected offers: Offer[] = []
  protected total = 0
  @Prop(String) public currentOwnerId!: string
  @Prop(String) public collectionId!: string
  @Prop(String) public nftId!: string

  get isOwner(): boolean {
    return Boolean(
      this.currentOwnerId &&
        this.accountId &&
        isSameAccount(this.currentOwnerId, this.accountId)
    )
  }

  // fetch() {
  //   this.fetchOffers()
  // }

  get tokenId(): [string, string] {
    return [this.collectionId, this.nftId]
  }

  public mounted() {
    this.$apollo.addSmartQuery<OfferResponse>('offers', {
      client: this.urlPrefix,
      query: offerListByNftId,
      variables: { id: createTokenId(this.collectionId, this.nftId) },
      manual: true,
      result: ({ data }) => this.setResponse(data),
      pollInterval: 15000,
    })
  }

  @Emit('offersUpdate')
  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
    this.total = response.stats.total
  }

  protected async fetchOffers() {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: offerListByNftId,
        variables: { id: createTokenId(this.collectionId, this.nftId) },
      })

      this.setResponse(data)
    } catch (e) {
      this.$consola.error(e)
    }
  }

  public onOfferSelected = async (maker: string) => {
    const { collectionId, nftId } = this
    await this.submit(maker, nftId, collectionId, this.fetchOffers)
  }
}
</script>
