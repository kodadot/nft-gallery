<template>
  <div class="offer-table-container">
    <b-table
      :data="displayOffers(offers)"
      :paginated="displayOffers(offers).length > itemsPerPage"
      :per-page="itemsPerPage"
      :class="{ scrollable: offers.length > 0 }"
      :current-page.sync="currentPage"
      pagination-position="top">
      <div v-if="headerText" class="has-text-centered offer-title mb-2">
        {{ headerText }}
      </div>
      <b-select v-model="selectedStatus">
        <option
          v-for="option in getUniqType(offers)"
          :key="option.type"
          :value="option.type">
          {{ option.value }}
        </option>
      </b-select>
      <b-table-column
        v-if="displayCollection"
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.collection')"
        field="nft.collection.name"
        sortable>
        <nuxt-link
          :to="`/${urlPrefix}/collection/${props.row.nft.collection.id}`">
          <p
            class="limit-width-text"
            :title="
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            ">
            {{
              props.row.nft.collection.name
                ? props.row.nft.collection.name
                : props.row.nft.collection.id
            }}
          </p>
        </nuxt-link>
      </b-table-column>
      <b-table-column
        v-if="isBsxStats"
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.nftName')"
        field="nft.name"
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
        field="caller"
        :label="$t('offer.caller')"
        sortable>
        <nuxt-link
          :to="{ name: `${urlPrefix}-u-id`, params: { id: props.row.caller } }">
          <Identity :address="props.row.caller" />
        </nuxt-link>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        :label="$t('offer.price')"
        sortable>
        <Money :value="props.row.price" :token-id="assetId" inline />
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="expirationBlock"
        :label="$t('offer.expiration')"
        sortable>
        <b-tooltip
          v-if="!isExpired(props.row.expiration)"
          :label="calcExpirationDate(props.row.expiration)">
          {{ calcExpirationTime(props.row.expiration) }}
        </b-tooltip>
        <span v-else>
          {{ calcExpirationTime(props.row.expiration) }}
        </span>
      </b-table-column>
      <b-table-column
        v-if="!isBsxStats"
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
          @click="tellFrens(props.row.caller)" />
        <b-button
          v-else-if="isOwner"
          type="is-success"
          outlined
          icon-left="money-bill"
          @click="tellFrens(props.row.caller)" />
      </b-table-column>
      <b-table-column
        v-if="isBsxStats"
        v-slot="props"
        field="status"
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.status')"
        sortable>
        <p>{{ props.row.status }}</p></b-table-column
      >
      <b-table-column
        v-if="isBsxStats"
        v-slot="props"
        field="createdAt"
        cell-class="is-vcentered is-narrow"
        :label="$t('nft.offer.date')"
        sortable
        ><p>
          {{ new Date(props.row.createdAt) | formatDistanceToNow }}
        </p></b-table-column
      >
      <template #empty>
        <div class="has-text-centered">
          {{ $t('nft.offer.empty') }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Attribute, emptyArray } from '@kodadot1/minimark'
import { Component, Emit, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { formatDistanceToNow } from 'date-fns'

import { Offer } from './types'
import OfferMixin from '@/utils/mixins/offerMixin'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Money: () => import('@/components/bsx/format/TokenMoney.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
}

@Component({ components, filters: { formatDistanceToNow } })
export default class OfferTable extends mixins(OfferMixin) {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  @Prop(Boolean) public isOwner!: boolean
  @Prop(Boolean) public isBsxStats!: boolean
  @Prop({ type: String, default: '' }) public headerText!: string
  @Prop(Boolean) public isCollection!: boolean
  @Prop({ type: Boolean, default: false }) public displayCollection!: boolean
  public currentBlock = 0
  public itemsPerPage = 20
  private currentPage = parseInt(this.$route.query?.page as string) || 1

  @Emit('select')
  tellFrens(caller: string) {
    return caller
  }
  get urlPrefix() {
    return this.$store.getters.currentUrlPrefix
  }

  get assetId() {
    return getKusamaAssetId(this.urlPrefix)
  }

  @Watch('currentPage')
  watchPageValue(val) {
    this.replaceUrl(String(val))
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'page') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
<style lang="scss">
.offer-table-container {
  .scrollable.table-wrapper {
    overflow-x: scroll;
  }
  .limit-width-text {
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .offer-title {
    line-height: 2rem;
    font-size: 1.2rem;
  }
  .pagination-list {
    margin: 0;
  }
}
</style>
