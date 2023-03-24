<template>
  <div>
    <div
      v-for="[
        flipperId,
        { bestFlip, owned, totalBought, totalsold, latestflipTimestamp, flips },
      ] in flippers"
      :key="flipperId"
      class="hide-last-hr">
      <div class="is-flex is-flex-direction-column gap">
        <ProfileLink :address="flipperId" />
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.owned') }}</span>
          <span>{{ owned }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.totalBought') }}</span>
          <Money :value="totalBought" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.totalSold') }}</span>
          <Money :value="totalsold" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{ $t('activity.bestFlip') }}</span>
          <span :class="{ 'k-green': bestFlip > 0, 'k-red': bestFlip < 0 }">{{
            bestFlip === 0 ? '--' : `${bestFlip}%`
          }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">{{
            $t('activity.latestActivity')
          }}</span>
          <span class="no-wrap">{{ timeAgo(latestflipTimestamp) }}</span>
        </div>
        <div>
          <div
            class="is-size-7 k-blue is-clickable"
            @click="toggleNFTDetails(flipperId)">
            {{ $t('activity.nftDetails') }}
            <NeoIcon
              :icon="
                isNFTDetailsOpen[flipperId] ? 'chevron-down' : 'chevron-right'
              " />
          </div>

          <div v-if="isNFTDetailsOpen[flipperId]">
            <MoreNFTS :flips="flips" variant="Flippers" />
          </div>
        </div>
      </div>
      <hr class="my-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Flippers } from '@/components/collection/utils/types'
import ProfileLink from '@/components/rmrk/Profile/ProfileLink.vue'
import Money from '@/components/shared/format/ChainMoney.vue'
import { NeoIcon } from '@kodadot1/brick'
import { set } from 'vue'

import MoreNFTS from './moreNFTS.vue'
import { timeAgo } from '../utils'

const toggleNFTDetails = (flipperId: string) => {
  const isOpen = isNFTDetailsOpen.value[flipperId]
  set(isNFTDetailsOpen.value, flipperId, !isOpen)
}

const flippers = computed(() => Object.entries(props.flippers || {}))

// map of flipper id to bolean, is the NFT details section of that flipper open or nor
// {id0: false, id1: true, id3: false, ...}
const isFlipperMoreNFTSectionOpen = flippers.value.reduce(
  (accumelator, [holderId, _]) => ({
    ...accumelator,
    [holderId]: false,
  }),
  {}
)
const isNFTDetailsOpen = ref(isFlipperMoreNFTSectionOpen)

const props = defineProps<{
  flippers?: Flippers
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
.k-green {
  @include ktheme() {
    color: theme('k-green');
  }
}
.k-red {
  @include ktheme() {
    color: theme('k-red');
  }
}
</style>
