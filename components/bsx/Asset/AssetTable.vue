<template>
  <div class="offer-table-container">
    <b-table
      :data="assetList"
      :class="{ scrollable: assetList.length > 0 }"
      pagination-position="top">
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        width="120"
        :label="$t('mint.collection.symbol.label')"
        sortable>
        {{ props.row.symbol }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        field="formatPrice"
        :label="$t('asset.table.balance')"
        sortable>
        <Money :value="props.row.balance" inline hide-unit />
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered is-narrow"
        :label="$t('offer.action')">
        <span v-if="props.row.id === currentAsset">
          {{ $t('asset.action.alreadyDefault') }}
        </span>
        <b-button
          v-else
          type="is-success"
          outlined
          icon-left="money-bill"
          @click="tellFrens(props.row.id)">
          {{ $t('asset.action.default') }}
        </b-button>
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">
          {{ $t('asset.table.empty') }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { emptyArray } from '@kodadot1/minimark'
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { AssetItem } from './types'

@Component({
  components: {
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class AssetTable extends Vue {
  @Prop(String) public accountId!: string
  @Prop(String) public currentAsset!: string

  @Prop({ type: Array, default: () => emptyArray<AssetItem>() })
  public assetList!: AssetItem[]

  @Emit('select')
  tellFrens(id: string) {
    return id
  }
}
</script>
