<template>
  <div>
    <div class="is-flex is-align-items-center is-justify-content-center mb-5">
      <AddressInput
        class="address-input mr-3"
        v-model="destinationAddress"
        :strict="false" />
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        @click="checkOfferForAddress"
        :disabled="!correctAddress"
        outlined>
        {{ $t('offer.checkOffers') }}
      </b-button>
    </div>
    <Loader v-model="isLoading" :status="status" />
    <section>
      <b-tabs class="tabs-container-mobile" v-model="activeTab" expanded>
        <b-tab-item
          :label="`${$t('offer.offersCreated')} ${
            offers.length ? ' - ' + offers.length : ''
          }`"
          value="created">
          <OffersUserTable :offers="offers" :ownerId="''" hideToggle />
        </b-tab-item>
        <b-tab-item
          :label="`${$t('offer.incomingOffers')}  ${
            incomingOffersCount ? ' - ' + incomingOffersCount : ''
          }`"
          value="incoming">
          <MyOffer
            :address="accountIdChanged"
            hideHeading
            @offersIncoming="offersIncomingUpdate" />
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'
import offerListUser from '@/queries/subsquid/bsx/offerListUser.graphql'
import { notificationTypes, showNotification } from '~/utils/notification'
import correctFormat from '@/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import ChainMixin from '~/utils/mixins/chainMixin'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
  StatsOverview: () => import('~/components/bsx/Offer/StatsOverview.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  OffersUserTable: () => import('@/components/bsx/Offer/OffersUserTable.vue'),
  MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
}

@Component({ components })
export default class MasterOfferTable extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  SubscribeMixin,
  ChainMixin
) {
  protected offers: Offer[] = []
  protected total = 0
  protected destinationAddress = ''
  protected accountIdChanged = ''
  protected incomingOffersCount = 0

  public async created() {
    this.checkQueryParams()
  }

  fetch() {
    this.fetchOffers()
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  get activeTab(): string {
    return (this.$route.query.tab as string) || 'created'
  }

  set activeTab(val) {
    const { target } = this.$route.query
    this.$router.replace({
      query: { target, tab: val },
    })
  }

  get correctAddress(): string {
    return this.destinationAddress
      ? encodeAddress(this.destinationAddress, correctFormat(this.ss58Format))
      : ''
  }

  public offersIncomingUpdate(data) {
    this.incomingOffersCount = data.offers.length
  }

  protected checkQueryParams() {
    const { query } = this.$route
    if (query.target) {
      const hasAddress = isAddress(query.target as string)
      if (hasAddress) {
        this.destinationAddress = query.target as string
        this.accountIdChanged = query.target as string
      } else {
        showNotification('Unable to use target address', notificationTypes.warn)
      }
    } else {
      this.destinationAddress = this.accountId
    }
  }

  public checkOfferForAddress() {
    this.fetchOffers()
    this.accountIdChanged = this.destinationAddress
  }

  protected setResponse(response: OfferResponse) {
    this.offers = response.offers
  }

  protected async fetchOffers() {
    try {
      const { data } = await this.$apollo.query<OfferResponse>({
        query: offerListUser,
        client: this.client,
        variables: {
          id: this.destinationAddress || this.accountId,
          burned: false,
        },
      })
      if (data?.offers?.length) {
        this.offers = data.offers
      } else {
        this.offers = []
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  @Watch('destinationAddress')
  destinationChanged(target: string): void {
    const { tab } = this.$route.query
    this.$router.replace({ query: { target, tab } }).catch(() => null) // null to further not throw navigation errors
  }
}
</script>
<style scoped>
.address-input {
  width: 500px;
}
</style>
