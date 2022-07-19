<template>
  <div>
    <div class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('myOffer.bsxTitle') }}
      </h1>
    </div>
    <Loader v-model="isLoading" :status="status" />
    <b-table :data="offers">
      <b-table-column
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.item')"
        v-slot="props"
        sortable>
        <nuxt-link :to="`gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
          </p>
        </nuxt-link>
      </b-table-column>
      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="price"
        :label="$t('myOffer.price')"
        v-slot="props"
        sortable>
        <Money :value="props.row.price" inline />
      </b-table-column>
      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="caller"
        :label="$t('myOffer.caller')"
        v-slot="props"
        sortable>
        <nuxt-link :to="{ name: 'bsx-u-id', params: { id: props.row.caller } }">
          <Identity :address="props.row.caller" inline noOverflow />
        </nuxt-link>
      </b-table-column>
      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="expiration"
        :label="$t('offer.expiration')"
        v-slot="props"
        sortable>
        {{ calcExpirationTime(props.row.expiration) }}
      </b-table-column>
      <b-table-column
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.action')"
        v-slot="props"
        width="120"
        sortable>
        <b-button
          v-if="props.row.caller === accountId"
          type="is-orange"
          outlined
          icon-left="times"
          @click="onClick(props.row)" />
        <b-button
          v-else
          type="is-success"
          outlined
          icon-left="money-bill"
          @click="onClick(props.row)" />
      </b-table-column>
      <b-table-column
        field="Date"
        cell-class="is-vcentered is-narrow"
        :label="$t('myOffer.date')"
        v-slot="props"
        ><p>
          {{
            new Date(props.row.createdAt) |
              formatDistanceToNow({ addSuffix: true })
          }}
        </p></b-table-column
      >
      <template #empty>
        <div class="has-text-centered">
          {{ $t(isLogIn ? 'myOffer.empty' : 'myOffer.needLogin') }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import offerListByCurrentOwner from '@/queries/subsquid/bsx/offerListByCurrentOwner.graphql'
import { formatDistanceToNow } from 'date-fns'
import OfferMixin from '~/utils/mixins/offerMixin'
import { tokenIdToRoute } from '@/components/unique/utils'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({
  components,
  filters: { formatDistanceToNow },
})
export default class MyOffer extends mixins(PrefixMixin, OfferMixin) {
  protected offers: Offer[] = []

  mounted() {
    if (this.accountId) {
      this.$apollo.addSmartQuery<OfferResponse>('offers', {
        client: this.urlPrefix,
        query: offerListByCurrentOwner,
        variables: { id: this.accountId },
        manual: true,
        result: ({ data }) => this.setResponse(data),
        pollInterval: 10000,
      })
    }
  }

  public onClick = async (offer: Offer) => {
    const { caller, nft } = offer
    const { id: collectionId, item } = tokenIdToRoute(nft.id)
    this.isLoading = true
    await this.submit(caller, item, collectionId, this.fetchMyOffers)
  }

  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
  }

  protected async fetchMyOffers() {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: offerListByCurrentOwner,
        variables: {
          id: this.accountId,
        },
      })
      this.setResponse(data)
    } catch (e) {
      this.$consola.error(e)
    }
  }

  @Watch('accountId', { immediate: true })
  onAccountChange() {
    this.fetchMyOffers()
  }
}
</script>
<style scoped>
.limit-width-text {
  max-width: 50ch;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
