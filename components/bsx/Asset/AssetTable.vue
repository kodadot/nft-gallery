<template>
  <div class="offer-table-container">
    <NeoTable
      :data="assetList"
      :class="{ scrollable: assetList.length > 0 }"
      pagination-position="top">
      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        width="120"
        :label="$t('general.token')"
        sortable>
        {{ props.row.symbol }}
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="formatPrice"
        :label="$t('asset.table.balance')"
        sortable>
        <Money :value="props.row.balance" inline hide-unit />
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" :label="$t('offer.action')">
        <span v-if="props.row.id === currentAsset">
          {{ $t('asset.action.alreadyDefault') }}
        </span>
        <NeoButton
          v-else
          icon-left="money-bill"
          @click="tellFrens(props.row.id)">
          {{ $t('asset.action.default') }}
        </NeoButton>
      </NeoTableColumn>

      <template #empty>
        <div class="w-100 has-text-centered">
          {{ $t('asset.table.empty') }}
        </div>
      </template>
    </NeoTable>
  </div>
</template>

<script lang="ts" setup>
import { emptyArray } from '@kodadot1/minimark/utils'
import { NeoButton, NeoTable, NeoTableColumn } from '@kodadot1/brick'
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
