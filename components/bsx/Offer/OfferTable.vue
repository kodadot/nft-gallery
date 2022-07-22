<template>
  <b-table :data="offers">
    <div class="has-text-centered offer-title">
      {{ $t('nft.offer.title') }}
    </div>
    <b-table-column
      v-if="isBsxStats"
      cell-class="is-vcentered is-narrow"
      :label="$t('offer.collection')"
      v-slot="props"
      field="nft.collection.name"
      sortable>
      <nuxt-link :to="`/bsx/collection/${props.row.nft.collection.id}`">
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
      cell-class="is-vcentered is-narrow"
      :label="$t('offer.nftName')"
      v-slot="props"
      field="nft.name"
      sortable>
      <nuxt-link :to="`/bsx/gallery/${props.row.nft.id}`">
        <p
          class="limit-width-text"
          :title="props.row.nft.name ? props.row.nft.name : props.row.nft.id">
          {{ props.row.nft.name ? props.row.nft.name : props.row.nft.id }}
        </p>
      </nuxt-link>
    </b-table-column>
    <b-table-column
      cell-class="is-vcentered is-narrow"
      field="caller"
      :label="$t('offer.caller')"
      v-slot="props"
      sortable>
      <nuxt-link :to="{ name: 'bsx-u-id', params: { id: props.row.caller } }">
        <Identity :address="props.row.caller" inline noOverflow />
      </nuxt-link>
    </b-table-column>

    <b-table-column
      cell-class="is-vcentered is-narrow"
      field="price"
      :label="$t('offer.price')"
      v-slot="props"
      sortable>
      <Money :value="props.row.price" inline />
    </b-table-column>
    <b-table-column
      v-if="!isBsxStats"
      cell-class="is-vcentered is-narrow"
      field="expiration"
      :label="$t('offer.expiration')"
      v-slot="props"
      sortable>
      {{ calcExpirationTime(props.row.expiration) }}
    </b-table-column>
    <b-table-column
      v-if="!isBsxStats"
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
      field="status"
      cell-class="is-vcentered is-narrow"
      :label="$t('nft.offer.status')"
      v-slot="props"
      sortable>
      <p>{{ props.row.status }}</p></b-table-column
    >
    <b-table-column
      v-if="isBsxStats"
      field="Date"
      cell-class="is-vcentered is-narrow"
      :label="$t('nft.offer.date')"
      v-slot="props"
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
</template>

<script lang="ts">
import { Attribute, emptyArray } from '@kodadot1/minimark'
import { Component, Emit, Prop, mixins } from 'nuxt-property-decorator'
import { Offer } from './types'
import { formatDistanceToNow } from 'date-fns'
import OfferMixin from '~/utils/mixins/offerMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components, filters: { formatDistanceToNow } })
export default class OfferTable extends mixins(OfferMixin) {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  @Prop(Boolean) public isOwner!: boolean
  @Prop(Boolean) public isBsxStats!: boolean

  @Emit('select')
  tellFrens(caller: string) {
    return caller
  }
  get urlPrefix() {
    return this.$store.getters.currentUrlPrefix
  }
}
</script>
<style scoped>
.limit-width-text {
  max-width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
}
.offer-title {
  line-height: 2rem;
  font-size: 1.2rem;
  border-bottom: 1px solid hsl(0deg, 0%, 86%);
}
</style>
