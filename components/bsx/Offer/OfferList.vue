<template>
  <CollapseCardWrapper label="offers">
    <Loader v-model="isLoading" :status="status" />
    <p class="title is-size-4 has-text-success">
      {{ $t('nft.offer.count', [total]) }}
    </p>
    <OfferTable :offers="offers" @select="submit" :accountId="accountId" />
  </CollapseCardWrapper>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { isSameAccount } from '~/utils/account'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import Connector from '@kodadot1/sub-api'
import { notificationTypes, showNotification } from '~/utils/notification'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { createTokenId } from '~/components/unique/utils'
import offerListByNftId from '@/queries/subsquid/bsx/offerListByNftId.graphql'

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
  PrefixMixin
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

  fetch() {
    this.fetchOffers()
  }

  protected async fetchOffers() {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: offerListByNftId,
        variables: { id: createTokenId(this.collectionId, this.nftId) },
      })

      this.offers = data.offers
      this.total = data.stats.total
    } catch (e) {
      this.$consola.error(e)
    }
  }

  protected async submit(maker: string) {
    const { collectionId, nftId } = this
    try {
      const { api } = Connector.getInstance()
      this.initTransactionLoader()
      const cb = !isSameAccount(this.accountId, maker)
        ? api.tx.marketplace.acceptOffer
        : api.tx.marketplace.withDrawOffer
      const args = [collectionId, nftId, maker]

      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        showNotification(
          `[OFFER] THIS NFT belongs to ${maker} since block ${blockNumber}`,
          notificationTypes.success
        )
      })
    } catch (e: any) {
      showNotification(`[OFFER::ERR] ${e}`, notificationTypes.danger)
      this.$consola.error(e)
      this.isLoading = false
    }
  }
}
</script>
