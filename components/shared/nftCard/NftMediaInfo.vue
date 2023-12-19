<template>
  <div
    class="nft-media-info is-flex is-flex-direction-column"
    :class="`nft-media-info__${variant}`">
    <div class="is-flex is-flex-direction-column">
      <span
        class="is-ellipsis has-text-weight-bold"
        data-testid="nft-name"
        :title="nft.name"
        >{{ nft.name || '--' }}</span
      >
      <CollectionDetailsPopover
        v-if="!isMinimal && (nft.collection.name || nft.collection.id)"
        :show-delay="collectionPopoverShowDelay"
        class="is-size-7 nft-info-collection-name is-ellipsis"
        :nft="nft">
        <template #content>
          <a
            :v-safe-href="`/${prefix}/collection/${nft.collection.id}`"
            class="nft-info-collection-name">
            {{ nft.collection.name || '--' }}
          </a>
        </template>
      </CollectionDetailsPopover>
    </div>

    <div
      class="is-flex is-align-items-center mt-2 is-ellipsis nft-media-info-footer"
      :class="[
        showPrice
          ? 'is-justify-content-space-between'
          : 'is-justify-content-end',
      ]">
      <CommonTokenMoney
        v-if="showPrice"
        :value="nft.price ?? nft.cheapest?.price"
        data-testid="card-money" />
      <span v-if="!isMinimal" class="chain-name is-capitalized is-size-7">{{
        getChainNameByPrefix(prefix)
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getChainNameByPrefix } from '@/utils/chain'
import type { NeoNFT, NftCardVariant } from './types'

const props = withDefaults(
  defineProps<{
    nft: NeoNFT
    prefix: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
  },
)

const isMinimal = computed(() =>
  props.variant ? props.variant.includes('minimal') : false,
)
</script>
