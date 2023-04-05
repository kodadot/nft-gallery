<template>
  <div>
    <div v-for="[holderId, holdings] in holders" :key="holderId" class="">
      <div class="is-flex is-flex-direction-column gap">
        <div class="px-5">
          <ProfileLink
            :address="holderId"
            :avatar-size="35"
            class="has-text-weight-bold" />
          <div class="is-flex is-justify-content-space-between">
            <span class="is-size-7 has-text-grey">{{
              $t('activity.owned')
            }}</span>
            <span>{{ holdings.nftCount }}</span>
          </div>
          <div class="is-flex is-justify-content-space-between">
            <span class="is-size-7 has-text-grey">{{
              $t('activity.totalBought')
            }}</span>
            <Money :value="holdings.totalBought" />
          </div>
          <div class="is-flex is-justify-content-space-between">
            <span class="is-size-7 has-text-grey">{{
              $t('activity.totalSold')
            }}</span>
            <Money v-if="holdings.totalSold > 0" :value="holdings.totalSold" />
            <span v-else>--</span>
          </div>
          <div class="is-flex is-justify-content-space-between">
            <span class="is-size-7 has-text-grey">{{
              $t('activity.date')
            }}</span>
            <span>{{ timeAgo(holdings.lastActivityTimestamp) }}</span>
          </div>
          <div>
            <div
              class="is-size-7 has-text-k-blue is-clickable"
              @click="toggleNFTDetails(holderId)">
              {{ $t('activity.nftDetails') }}
              <NeoIcon
                :icon="
                  isNFTDetailsOpen[holderId] ? 'chevron-down' : 'chevron-right'
                " />
            </div>
          </div>
        </div>

        <div v-if="isNFTDetailsOpen[holderId]">
          <NFTsDetaislDropdown :holder-nfts="holdings.nfts" variant="Holders" />
        </div>
      </div>
      <hr class="my-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileLink from '@/components/rmrk/Profile/ProfileLink.vue'
import { Owners } from '@/composables/collectionActivity/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import { NeoIcon } from '@kodadot1/brick'

import NFTsDetaislDropdown from './NFTsDetaislDropdown.vue'
import { timeAgo } from '@/components/collection/utils/timeAgo'

const toggleNFTDetails = (flipperId: string) => {
  const isOpen = isNFTDetailsOpen.value[flipperId]
  isNFTDetailsOpen.value = {
    ...isNFTDetailsOpen.value,
    [flipperId]: !isOpen,
  }
}

const holders = computed(() =>
  Object.entries(props.owners || {}).sort(
    // sort by nft count: highest first
    (a, b) => b[1].nftCount - a[1].nftCount
  )
)

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
.gap {
  gap: 0.5rem;
}
.hide-last-hr:last-child > hr {
  display: none;
}
</style>
