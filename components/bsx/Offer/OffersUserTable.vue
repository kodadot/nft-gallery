<template>
  <div>
    <b-select v-model="selectedStatus" v-if="!offersListed">
      <option
        v-for="option in uniqType"
        :value="option.type"
        :key="option.type">
        {{ option.value }}
      </option>
    </b-select>
    <BasicSwitch
      class="mt-4"
      v-model="offersListed"
      @input="updateList"
      :label="$t('offer.burnedToggle')"
      size="is-medium"
      labelColor="is-success" />
    <b-table :data="updatedOffers">
      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="nft.name"
        :label="$t('nft.offer.item')"
        v-slot="props"
        sortable>
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.nft.id}`">
          <p
            class="limit-width-text"
            :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
            {{ props.row.nft.name || props.row.nft.id }}
          </p>
        </nuxt-link>
      </b-table-column>
      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="status"
        :label="$t('nft.offer.status')"
        v-slot="props"
        sortable>
        <p>{{ props.row.status || '-' }}</p>
      </b-table-column>

      <b-table-column
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        :label="$t('offer.price')"
        v-slot="props"
        sortable>
        <Money :value="props.row.price" inline />
      </b-table-column>
      <b-table-column
        field="createdAt"
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.date')"
        v-slot="props"
        sortable
        ><p>
          {{ timestampOffer(props.row.createdAt) }}
        </p></b-table-column
      >
      <b-table-column
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.action')"
        v-slot="props"
        width="120">
        <b-button
          v-if="props.row.status === 'ACTIVE'"
          type="is-orange"
          outlined
          icon-left="times"
          @click="withdrawOffer(props.row)" />
      </b-table-column>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Attribute, emptyArray } from '@kodadot1/minimark'
import { Component, Emit, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'
import { Offer } from './types'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import OfferMixin from '~/utils/mixins/offerMixin'
import Connector from '@kodadot1/sub-api'
import AuthMixin from '~/utils/mixins/authMixin'
import MetaTransactionMixin from '~/utils/mixins/metaMixin'
import SubscribeMixin from '~/utils/mixins/subscribeMixin'
import { notificationTypes, showNotification } from '~/utils/notification'
import { tokenIdToRoute } from '~/components/unique/utils'
import { AllOfferStatusType } from '~/utils/offerStatus'
import shouldUpdate from '~/utils/shouldUpdate'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
}

@Component({ components, filters: { formatDistanceToNow } })
export default class OffersUserTable extends mixins(
  PrefixMixin,
  AuthMixin,
  OfferMixin,
  MetaTransactionMixin,
  SubscribeMixin
) {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  protected offerStatus: AllOfferStatusType = AllOfferStatusType.ALL
  protected offersUpdated: Offer[] = []
  protected offersListed = false

  get uniqType(): { type: AllOfferStatusType; value: string }[] {
    const statusSet = new Set(this.offers.map((offer) => offer.status))
    const singleEventList = Array.from(statusSet).map((type) => ({
      type: type as AllOfferStatusType,
      value: AllOfferStatusType[type],
    }))
    return [{ type: AllOfferStatusType.ALL, value: 'All' }, ...singleEventList]
  }

  get updatedOffers() {
    return this.displayOffers(this.offersUpdated)
  }

  get selectedStatus() {
    return this.offerStatus
  }

  set selectedStatus(value: AllOfferStatusType) {
    if (value === AllOfferStatusType.ALL) {
      this.offersUpdated = this.offers.concat()
    } else {
      this.offersUpdated = this.offers.filter((offer) => offer.status === value)
    }
    this.status = value
  }

  @Watch('offers', { immediate: true })
  hasOffers(value: string, oldVal: string) {
    if (shouldUpdate(value, oldVal)) {
      this.offersUpdated = this.offers
    }
  }

  @Emit('offersListUpdate')
  public updateList(data) {
    this.offersUpdated = []
    return data
  }

  public timestampOffer(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  async withdrawOffer(offer) {
    const { caller, nft } = offer
    try {
      const { api } = Connector.getInstance()
      this.initTransactionLoader()
      const cb = api.tx.marketplace.withdrawOffer
      const { id, item } = tokenIdToRoute(nft.id)
      const args = [id, item, caller]
      await this.howAboutToExecute(this.accountId, cb, args, (blockNumber) => {
        const msg = 'your offer has been withdrawn'
        showNotification(
          `[OFFER] Since block ${blockNumber} ${msg}`,
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
<style scoped>
.limit-width-text {
  max-width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
