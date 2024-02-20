<template>
  <div
    class="nft-media-info flex flex-col"
    :class="`nft-media-info__${variant}`">
    <div class="flex flex-col">
      <span
        class="is-ellipsis font-bold"
        data-testid="nft-name"
        :title="name"
        >{{ name || '--' }}</span
      >
      <CollectionDetailsPopover
        v-if="!isMinimal && (nft.collection.name || nft.collection.id)"
        :show-delay="collectionPopoverShowDelay"
        class="text-xs text-k-grey hover:text-text-color is-ellipsis"
        :nft="nft">
        <template #content>
          <a
            :v-safe-href="`/${prefix}/collection/${nft.collection.id}`"
            class="text-k-grey hover:text-text-color">
            {{ nft.collection.name || '--' }}
          </a>
        </template>
      </CollectionDetailsPopover>
    </div>

    <div
      class="flex items-center mt-2 is-ellipsis nft-media-info-footer"
      :class="[showPrice ? 'justify-between' : 'justify-end']">
      <CommonTokenMoney
        v-if="showPrice"
        :value="nft.price ?? nft.cheapest?.price"
        data-testid="card-money" />
      <span
        v-if="!isMinimal && !isGenerative"
        class="text-k-grey capitalize text-xs"
        >{{ getChainNameByPrefix(prefix) }}</span
      >
      <span
        v-else-if="isGenerative"
        class="text-k-grey capitalize text-xs tag-container rounded-[2rem] flex py-1 px-2 justify-between items-center"
        >{{ formatTimestamp(timestamp) }}</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getChainNameByPrefix } from '@/utils/chain'
import type { NeoNFT, NftCardVariant } from './types'
import { addSnSuffixName } from '@/utils/nft'

const props = withDefaults(
  defineProps<{
    nft: NeoNFT
    prefix: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
    displayNameWithSn?: boolean
    timestamp?: number
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
    timestamp: +new Date(),
  },
)

const name = computed(() => {
  const originalName = props.nft.name
  if (!props.displayNameWithSn) {
    return originalName
  }
  const sn = isTokenEntity(props.nft)
    ? props.nft?.cheapest?.id?.split('-')[1]
    : props.nft?.sn

  return sn ? addSnSuffixName(props.nft.name, sn) : originalName
})
const isMinimal = computed(() =>
  props.variant ? props.variant.includes('minimal') : false,
)
const isGenerative = computed(() => props.variant === 'generative')

const formatTimestamp = (timestamp) => {
  const lastIndex = timestamp.lastIndexOf(' ')
  return timestamp.substring(0, lastIndex)
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables.scss';
.tag-container {
  @include ktheme() {
    background-color: theme('k-grey-light');
    color: theme('text-color');
  }
}
</style>
