<template>
  <b-table :data="offers">
    <b-table-column
      cell-class="is-vcentered"
      field="caller"
      :label="$t('offer.caller')"
      v-slot="props"
      sortable>
      <nuxt-link :to="{ name: 'bsx-u-id', params: { id: props.row.caller } }">
        <Identity :address="props.row.caller" inline noOverflow />
      </nuxt-link>
    </b-table-column>

    <b-table-column
      cell-class="is-vcentered"
      field="price"
      :label="$t('offer.price')"
      v-slot="props"
      sortable>
      <Money :value="props.row.price" inline hideUnit />
    </b-table-column>
    <b-table-column
      v-if="!isBsxStats"
      cell-class="is-vcentered"
      field="expiration"
      :label="$t('offer.expiration')"
      v-slot="props"
      sortable>
      {{ props.row.expiration }}
    </b-table-column>
    <b-table-column
      v-if="!isBsxStats"
      cell-class="is-vcentered"
      :label="$t('offer.action')"
      v-slot="props"
      width="120"
      sortable>
      <b-button
        v-if="isOwner"
        type="is-success"
        outlined
        icon-left="money-bill"
        @click="tellFrens(props.row.caller)" />
      <b-button
        v-if="props.row.caller === accountId"
        type="is-orange"
        outlined
        icon-left="times"
        @click="tellFrens(props.row.caller)" />
    </b-table-column>
    <b-table-column
      v-if="isBsxStats"
      cell-class="is-vcentered"
      :label="$t('nft.offer.item')"
      v-slot="props"
      sortable>
      <nuxt-link :to="`gallery/${props.row.nft.id}`">
        <p v-if="props.row.nft.name">{{ props.row.nft.name }}</p>
        <p v-else>{{ props.row.nft.id }}</p>
      </nuxt-link>
    </b-table-column>
    <b-table-column
      v-if="isBsxStats"
      field="status"
      cell-class="is-vcentered"
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
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { Offer } from './types'
import { formatDistanceToNow } from 'date-fns'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components, filters: { formatDistanceToNow } })
export default class OfferTable extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  @Prop(Boolean) public isOwner!: boolean
  @Prop(String) public accountId!: string
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
