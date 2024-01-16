<template>
  <div>
    <div
      v-if="displayedHolders.length"
      data-testid="collection-holders-container">
      <div
        v-for="[holderId, holdings] in displayedHolders"
        :key="holderId"
        class=""
        data-testid="collection-nft-holder">
        <div class="flex flex-col gap">
          <div class="px-5">
            <ProfileLink
              :address="holderId"
              :avatar-size="35"
              data-testid="collection-nft-holder-address"
              class="has-text-weight-bold" />
            <div class="flex justify-between mt-2">
              <span class="text-xs text-k-grey">{{
                $t('activity.owned')
              }}</span>
              <span>{{ holdings.nftCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.totalBought')
              }}</span>
              <CommonTokenMoney :value="holdings.totalBought" />
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.totalSold')
              }}</span>
              <CommonTokenMoney
                v-if="holdings.totalSold > 0"
                :value="holdings.totalSold" />
              <span v-else>--</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{ $t('activity.date') }}</span>
              <TimeAgo :timestamp="holdings.lastActivityTimestamp" />
            </div>
            <div>
              <div
                class="text-xs has-text-k-blue is-clickable"
                data-testid="collection-holder-nft-details"
                @click="toggleNFTDetails(holderId)">
                {{ $t('activity.nftDetails') }}
                <NeoIcon
                  :icon="
                    isNFTDetailsOpen[holderId]
                      ? 'chevron-down'
                      : 'chevron-right'
                  " />
              </div>
            </div>
          </div>

          <div v-if="isNFTDetailsOpen[holderId]">
            <NFTsDetaislDropdown
              :holder-nfts="holdings.nfts"
              variant="Holders" />
          </div>
        </div>
        <hr class="my-3 mx-5" />
      </div>
      <div ref="target" />
    </div>
    <div v-else class="flex justify-center items-center pt-6 px-6">
      <div class="text-k-grey text-center">
        {{ $t('activity.noHolders') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileLink from '@/components/profile/ProfileLink.vue'
import { Owners } from '@/composables/collectionActivity/types'
import { NeoIcon } from '@kodadot1/brick'

import NFTsDetaislDropdown from './NFTsDetaislDropdown.vue'

const props = defineProps<{
  owners?: Owners
}>()

const toggleNFTDetails = (holderId: string) => {
  const isOpen = isNFTDetailsOpen.value[holderId]
  isNFTDetailsOpen.value = {
    ...isNFTDetailsOpen.value,
    [holderId]: !isOpen,
  }
}
const target = ref<HTMLElement | null>(null)
const offset = ref(4)

const holders = computed(() =>
  Object.entries(props.owners || {}).sort(
    // sort by nft count: highest first
    (a, b) => b[1].nftCount - a[1].nftCount,
  ),
)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    offset.value += 4
  }
})

const displayedHolders = computed(() => holders.value.slice(0, offset.value))

// map of owner id to bolean, is the NFT details section of that owner open or nor
// {id0: false, id1: true, id3: false, ...}
const isNFTDetailsOpen = ref(
  holders.value.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (isOpen, [holderId, _]) => ({
      ...isOpen,
      [holderId]: false,
    }),
    {},
  ),
)
</script>

<style lang="scss" scoped>
.gap {
  gap: 0.5rem;
}
.hide-last-hr:last-child > hr {
  display: none;
}
</style>
