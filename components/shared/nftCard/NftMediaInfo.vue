<template>
  <div
    class="nft-media-info flex flex-col"
    :class="[
      `nft-media-info__${variant}`,
      {
        'nft-media-info__slim': hideCollectionPopover,
      },
    ]"
  >
    <div class="flex flex-col">
      <span
        class="is-ellipsis font-bold"
        data-testid="nft-name"
        :title="name"
      >{{ name || '--' }}</span>
      <CollectionDetailsPopover
        v-if="
          !isMinimal
            && !hideCollectionPopover
            && (nft.collection.name || nft.collection.id)
        "
        :show-delay="collectionPopoverShowDelay"
        class="text-xs text-k-grey hover:text-text-color"
        :nft="nft"
      >
        <template #content>
          <a
            :v-safe-href="`/${prefix}/collection/${nft.collection.id}`"
            class="text-k-grey hover:text-text-color whitespace-nowrap"
          >
            {{ nft.collection.name || '--' }}
          </a>
        </template>
      </CollectionDetailsPopover>
    </div>

    <div
      class="flex items-center mt-2 is-ellipsis nft-media-info-footer"
      :class="[showPrice ? 'justify-between' : 'justify-end']"
    >
      <CommonTokenMoney
        v-if="showPrice"
        :value="nft.price ?? nft.cheapest?.price"
        data-testid="card-money"
      />

      <span
        v-if="showTimestamp"
        class="text-xs capitalize px-2 py-[2px] rounded-full bg-neutral-3 dark:bg-neutral-11"
      >
        {{ timestamp }}
      </span>

      <span
        v-else-if="!isMinimal"
        class="text-k-grey capitalize text-xs"
      >
        {{ getChainNameByPrefix(prefix) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDistanceToNowStrict } from 'date-fns'
import type { NeoNFT, NftCardVariant } from './types'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getChainNameByPrefix } from '@/utils/chain'

const props = withDefaults(
  defineProps<{
    nft: NeoNFT
    prefix: string
    showPrice?: boolean
    showTimestamp?: boolean
    hideCollectionPopover?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
  },
)

const name = computed(() => props.nft.name)
const isMinimal = computed(() =>
  props.variant ? props.variant.includes('minimal') : false,
)

const timestamp = computed(() =>
  formatDistanceToNowStrict(new Date(props.nft.createdAt as string)),
)
</script>
