<template>
  <CollapseCardWrapper :label="$t('nft.offer.label', [total])">
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-4 has-text-success" v-if="total">
      {{ $t('nft.offer.count', [total]) }}
    </p>
    <OfferTable
      :offers="offers"
      @select="submit"
      :accountId="accountId"
      :isOwner="isOwner" />
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import { isSameAccount } from '~/utils/account'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '~/utils/notification'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { createTokenId } from '~/components/unique/utils'
import offerListByNftId from '@/queries/subsquid/bsx/offerListByNftId.graphql'
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

  protected async submit(maker: string) {
    const { collectionId, nftId } = this
    try {
      const { api } = Connector.getInstance()
      this.initTransactionLoader()
      const isMe = isSameAccount(this.accountId, maker)
      const cb = !isMe
        ? api.tx.marketplace.acceptOffer
        : api.tx.marketplace.withdrawOffer
      const args = [collectionId, nftId, maker]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        const msg = !isMe ? 'nft is yours' : 'your offer has been withdrawn'
        showNotification(
          `[OFFER] Since block ${blockNumber} ${msg}`,
          notificationTypes.success
        )
      })
      this.fetchOffers()
    } catch (e: any) {
      showNotification(`[OFFER::ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
