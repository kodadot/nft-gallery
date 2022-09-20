<template>
  <div>
    <div class="is-flex is-align-items-start is-justify-content-center mb-5">
      <AddressInput
        v-model="destinationAddress"
        :empty-on-error="false"
        class="address-input mr-3"
        icon="close-circle"
        :strict="false"
        @input="handleAddressUpdate" />
      <b-button
        v-if="isLogIn"
        type="is-primary"
        icon-left="paper-plane"
        class="fill-button"
        outlined
        @click="fillUpAddress">
        Fill My Address
      </b-button>
    </div>
    <Loader v-model="isLoading" :status="status" />
    <section>
      <b-select
        v-model="selectedOfferType"
        class="mb-2"
        :disabled="isOfferDropdownDisabled">
        <option
          v-for="option in getOfferTypeOptions()"
          :key="option.type"
          :value="option.type">
          {{ option.label }}
        </option>
      </b-select>
      <template v-if="selectedOfferType === SelectedOfferType.CREATED">
        <OffersUserTable :offers="createdOffers" :owner-id="''" hide-toggle />
      </template>
      <div v-show="selectedOfferType === SelectedOfferType.INCOMING">
        <MyOffer
          :address="accountIdChanged"
          hide-heading
          @offersIncoming="offersIncomingUpdate" />
      </div>
      <template v-if="selectedOfferType === SelectedOfferType.ALL">
        <OfferTable
          :offers="
            skipUserOffer
              ? createdOffers
              : [...createdOffers, ...incomingOffers]
          "
          :account-id="accountId"
          is-bsx-stats
          display-collection />
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import { Offer, OfferResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'
import offerListUser from '@/queries/subsquid/bsx/offerListUser.graphql'
import { notificationTypes, showNotification } from '~/utils/notification'
import { isAddress } from '@polkadot/util-crypto'
import ChainMixin from '~/utils/mixins/chainMixin'
import { SelectedOfferType } from '~/utils/offerStatus'

const components = {
  Loader: () => import('@/components/shared/Loader.vue'),
  CollapseCardWrapper: () =>
    import('@/components/shared/collapse/CollapseCardWrapper.vue'),
  StatsOverview: () => import('~/components/bsx/Offer/StatsOverview.vue'),
  AddressInput: () => import('@/components/shared/AddressInput.vue'),
  OffersUserTable: () => import('@/components/bsx/Offer/OffersUserTable.vue'),
  MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
  OfferTable: () => import('@/components/bsx/Offer/OfferTable.vue'),
}

@Component({ components })
export default class MasterOfferTable extends mixins(
  AuthMixin,
  MetaTransactionMixin,
  PrefixMixin,
  SubscribeMixin,
  ChainMixin
) {
  protected createdOffers: Offer[] = []
  protected total = 0
  protected destinationAddress = ''
  protected accountIdChanged = ''
  protected incomingOffers: Offer[] = []
  protected SelectedOfferType = SelectedOfferType
  protected skipUserOffer = false // skip fetching with id when this variable is true

  public async created() {
    this.checkQueryParams()
  }

  fetch() {
    this.fetchCreatedOffers()
  }

  get isOfferDropdownDisabled(): boolean {
    return this.skipUserOffer
  }

  get ss58Format(): number {
    return this.chainProperties?.ss58Format
  }

  get selectedOfferType(): string {
    return (this.$route.query.tab as string) || SelectedOfferType.ALL
  }

  set selectedOfferType(val) {
    const { target } = this.$route.query
    this.$router.replace({
      query: { target, tab: val },
    })
  }

  public offersIncomingUpdate(data) {
    this.incomingOffers = data.offers
  }

  public getOfferTypeOptions() {
    return [
      {
        type: SelectedOfferType.ALL,
        label: 'All Offers',
      },
      {
        type: SelectedOfferType.CREATED,
        label: 'Offers Created',
      },
      {
        type: SelectedOfferType.INCOMING,
        label: 'Offers Incoming',
      },
    ]
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
      this.skipUserOffer = true
    }
  }

  public checkOfferForAddress(skipAddress = false) {
    this.skipUserOffer = skipAddress
    this.fetchCreatedOffers()
    this.accountIdChanged = this.destinationAddress
  }

  protected async fetchCreatedOffers() {
    try {
      let variables: any = {
        burned: false,
      }

      if (!this.skipUserOffer) {
        variables.id = this.destinationAddress || this.accountId
      }

      const { data } = await this.$apollo.query<OfferResponse>({
        query: offerListUser,
        client: this.client,
        variables: variables,
      })
      if (data?.offers?.length) {
        this.createdOffers = data.offers
        if (!this.skipUserOffer) {
          this.incomingOffers = []
        }
      } else {
        this.createdOffers = []
      }
    } catch (e) {
      showNotification(`${e}`, notificationTypes.warn)
    }
  }

  protected handleAddressUpdate(target: string) {
    const { tab } = this.$route.query
    if (target) {
      this.checkOfferForAddress()
      this.$router.replace({ query: { target, tab } }).catch(() => null) // null to further not throw navigation errors
    } else {
      this.selectedOfferType = SelectedOfferType.ALL
      this.checkOfferForAddress(true)
      this.$router.replace({ query: { tab } }).catch(() => null) // null to further not throw navigation errors
    }
  }

  private fillUpAddress() {
    this.destinationAddress = this.accountId
    this.handleAddressUpdate(this.accountId)
  }
}
</script>
<style scoped>
.address-input {
  width: 500px;
}

.fill-button {
  height: 3.25em;
}
</style>
