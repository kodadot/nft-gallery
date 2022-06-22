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
      cell-class="is-vcentered"
      field="expiration"
      :label="$t('offer.expiration')"
      v-slot="props"
      sortable>
      {{ props.row.expiration }}
    </b-table-column>
    <b-table-column
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

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class OfferTable extends Vue {
  @Prop({ type: Array, default: () => emptyArray<Attribute>() })
  public offers!: Offer[]
  @Prop(Boolean) public isOwner!: boolean
  @Prop(String) public accountId!: string

  @Emit('select')
  tellFrens(caller: string) {
    return caller
  }
}
</script>
