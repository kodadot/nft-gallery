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
          <span class="is-size-7 k-grey">Owned</span>
          <span>{{ owned }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">Total Bought</span>
          <Money :value="totalBought" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">Total Sold</span>
          <Money :value="totalsold" />
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">Best Flip</span>
          <span :class="{ 'k-green': bestFlip > 0, 'k-red': bestFlip < 0 }">{{
            bestFlip === 0 ? '--' : `${bestFlip}%`
          }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <span class="is-size-7 k-grey">Latest Activity</span>
          <span>{{ timeAgo(latestflipTimestamp) }}</span>
        </div>
        <div>
          <div
            class="is-size-7 k-blue is-clickable"
            @click="toggleNFTDetails(flipperId)">
            NFT details
            <NeoIcon
              :icon="
                isNFTDetailsOpen[flipperId] ? 'chevron-down' : 'chevron-right'
              " />
          </div>

          <div v-if="isNFTDetailsOpen[flipperId]">
            <MoreNFTS :nfts="flips.map((flip) => flip.nft)" />
          </div>
        </div>
      </div>
      <hr class="my-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Flippers } from '@/components/collection/utils/useCollectionDetails'
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

// map of owner id to bolean, is the NFT details section of that owner open or nor
// {id0: false, id1: true, id3: false, ...}
const isNFTDetailsOpen = ref(
  flippers.value.reduce(
    (isOpen, [flipperId, _]) => ({
      ...isOpen,
      [flipperId]: false,
    }),
    {}
  )
)

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
