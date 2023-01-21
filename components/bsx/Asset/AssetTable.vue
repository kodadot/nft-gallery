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

<script lang="ts" setup>
import { emptyArray } from '@kodadot1/minimark'
import { AssetItem } from './types'

const Money = defineAsyncComponent(
  () => import('@/components/shared/format/Money.vue')
)
const emit = defineEmits(['select'])
defineProps({
  accountId: { type: String, default: '' },
  currentAsset: { type: String, default: '' },
  assetList: { type: Array, default: () => emptyArray<AssetItem>() },
})

const tellFrens = (id: string) => {
  emit('select', id)
}
</script>
