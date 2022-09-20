<template>
  <div>
    <div v-if="!hideHeading" class="column is-8 is-offset-2">
      <h1 class="title is-2 has-text-centered">
        {{ $t('myOffer.bsxTitle') }}
      </h1>
    </div>
    <b-select v-model="selectedStatus">
      <option
        v-for="option in getUniqType(offers)"
        :key="option.type"
        :value="option.type">
        {{ option.value }}
      </option>
    </b-select>
    <Loader v-model="isLoading" :status="status" />
    <b-table :data="displayOffers(offers)">
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.item')"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
          </p>
        </nuxt-link>
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        :label="$t('myOffer.price')"
        sortable>
        <Money :value="props.row.price" inline />
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="caller"
        :label="$t('myOffer.caller')"
        sortable>
        <nuxt-link
          :to="{ name: `${urlPrefix}-u-id`, params: { id: props.row.caller } }">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="expirationBlock"
        :label="$t('offer.expiration')"
        sortable>
        {{ calcExpirationTime(props.row.expiration) }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.action')"
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
        v-slot="props"
        field="createdAt"
        cell-class="is-vcentered is-narrow"
        :label="$t('myOffer.date')"
        sortable
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
import { Component, Emit, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'

import { tokenIdToRoute } from '@/components/unique/utils'

import OfferMixin from '@/utils/mixins/offerMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import acceptableOfferByCurrentOwner from '@/queries/subsquid/bsx/acceptableOfferByCurrentOwner.graphql'

import { Offer, OfferResponse } from './types'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({
  components,
  filters: { formatDistanceToNow },
})
export default class MyOffer extends mixins(PrefixMixin, OfferMixin) {
  protected offers: Offer[] = []
  public destinationAddress = ''
  @Prop({ type: String, default: '' }) public address!: string
  @Prop({ type: Boolean, default: false }) public hideHeading!: boolean

  get targetAddress() {
    return this.destinationAddress || this.accountId
  }

  mounted() {
    if (this.targetAddress) {
      this.$apollo.addSmartQuery<OfferResponse>('offers', {
        client: this.urlPrefix,
        query: acceptableOfferByCurrentOwner,
        variables: { id: this.targetAddress },
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

  @Emit('offersIncoming')
  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
  }

  protected async fetchMyOffers() {
    if (!this.targetAddress) {
      return
    }

    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        client: this.urlPrefix,
        query: acceptableOfferByCurrentOwner,
        variables: {
          id: this.targetAddress,
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

  @Watch('address', { immediate: true })
  onAddressChange(value: string) {
    this.destinationAddress = value
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
