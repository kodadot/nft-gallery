<template>
  <div>
    <div
      v-for="[holderId, holdings] in holders"
      :key="holderId"
      class="hide-last-hr">
      <div class="is-flex is-flex-direction-column gap">
        <ProfileLink :address="holderId" />
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.owned') }}</span>
          <span>{{ holdings.nftCount }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.totalBought') }}</span>
          <Money :value="holdings.totalBought" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.totalSold') }}</span>
          <Money v-if="holdings.totalSold > 0" :value="holdings.totalSold" />
          <span v-else>--</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.date') }}</span>
          <span>{{ timeAgo(holdings.lastActivityTimestamp) }}</span>
        </div>
        <div>
          <div
            class="is-size-7 k-blue is-clickable"
            @click="toggleNFTDetails(holderId)">
            {{ $t('activity.nftDetails') }}
            <NeoIcon
              :icon="
                isNFTDetailsOpen[holderId] ? 'chevron-down' : 'chevron-right'
              " />
          </div>

          <div v-if="isNFTDetailsOpen[holderId]">
            <MoreNFTS :holder-nfts="holdings.nfts" variant="Holders" />
          </div>
        </div>
      </div>
      <hr class="my-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileLink from '@/components/rmrk/Profile/ProfileLink.vue'
import { Owners } from '@/components/collection/utils/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import { NeoIcon } from '@kodadot1/brick'
import { set } from 'vue'

import MoreNFTS from './moreNFTS.vue'
import { timeAgo } from '../utils'

const toggleNFTDetails = (holderId: string) => {
  const isOpen = isNFTDetailsOpen.value[holderId]
  set(isNFTDetailsOpen.value, holderId, !isOpen)
}

const holders = computed(() => Object.entries(props.owners || {}))

// map of owner id to bolean, is the NFT details section of that owner open or nor
// {id0: false, id1: true, id3: false, ...}
const isNFTDetailsOpen = ref(
  holders.value.reduce(
    (isOpen, [holderId, _]) => ({
      ...isOpen,
      [holderId]: false,
    }),
    {}
  )
)

const props = defineProps<{
  owners?: Owners
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.gap {
  gap: 0.5rem;
}
.hide-last-hr:last-child > hr {
  display: none;
}
.k-blue {
  @include ktheme() {
    color: theme('k-blue');
  }
  &:hover {
    @include ktheme() {
      color: theme('k-blue-hover');
    }
  }
}
.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
