<template>
  <div>
    <b-select v-if="!offersListed" v-model="selectedStatus">
      <option
        v-for="option in getUniqType(offers)"
        :key="option.type"
        :value="option.type">
        {{ option.value }}
      </option>
    </b-select>
    <BasicSwitch
      v-if="!hideToggle"
      v-model="offersListed"
      class="mt-4"
      :label="$t('offer.burnedToggle')"
      size="is-medium"
      label-color="has-text-success"
      @input="updateList" />
    <Loader v-model="isLoading" :status="status" />
    <b-table :data="displayOffers(offers)">
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="nft.name"
        :label="$t('nft.offer.item')"
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
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="status"
        :label="$t('nft.offer.status')"
        sortable>
        <p>{{ props.row.status || '-' }}</p>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        :label="$t('offer.price')"
        sortable>
        <CommonTokenMoney :value="props.row.price" inline />
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
        field="createdAt"
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.date')"
        sortable
        ><p>
          {{ timestampOffer(props.row.createdAt) }}
        </p></b-table-column
      >
      <b-table-column
        v-if="accountId === ownerId"
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.action')"
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
import { emptyArray } from '@kodadot1/minimark/utils'
import { Attribute } from '@kodadot1/minimark/common'
import { Component, Emit, Prop, mixins } from 'nuxt-property-decorator'
import { formatDistanceToNow } from 'date-fns'

import { tokenIdToRoute } from '@/components/unique/utils'

import AuthMixin from '@/utils/mixins/authMixin'
import MetaTransactionMixin from '@/utils/mixins/metaMixin'
import OfferMixin from '@/utils/mixins/offerMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import SubscribeMixin from '@/utils/mixins/subscribeMixin'

import { notificationTypes, showNotification } from '@/utils/notification'

import { Offer } from './types'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
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
  protected offersListed = false

  @Prop({ type: String, default: '' }) public ownerId!: string
  @Prop({ type: Boolean, default: false }) public hideToggle!: boolean

  @Emit('offersListUpdate')
  public updateList(data) {
    return data
  }

  public timestampOffer(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  async withdrawOffer(offer) {
    const { caller, nft } = offer
    try {
      const api = await this.useApi()
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
      showNotification(`[OFFER::ERR] ${e}`, notificationTypes.warn)
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
