<template>
  <div>
    <div v-if="flippers.length">
      <div
        v-for="[
          flipperId,
          {
            bestFlip,
            owned,
            totalBought,
            totalsold,
            latestflipTimestamp,
            flips,
          },
        ] in displayedFlippers"
        :key="flipperId"
        class="hide-last-hr"
      >
        <div class="flex flex-col gap-2">
          <div class="px-5">
            <ProfileLink
              :address="flipperId"
              :avatar-size="35"
              class="font-bold"
            />
            <div class="flex justify-between mt-2">
              <span class="text-xs text-k-grey">{{
                $t('activity.owned')
              }}</span>
              <span>{{ owned }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.totalBought')
              }}</span>
              <CommonTokenMoney :value="totalBought" />
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.totalSold')
              }}</span>
              <CommonTokenMoney :value="totalsold" />
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.bestFlip')
              }}</span>
              <span
                :class="{
                  'text-k-green': bestFlip > 0,
                  'text-k-red': bestFlip < 0,
                }"
              >{{ bestFlip === 0 ? '--' : `${format(bestFlip)}%` }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-k-grey">{{
                $t('activity.latestActivity')
              }}</span>
              <TimeAgo
                custom-class="whitespace-nowrap"
                :timestamp="latestflipTimestamp"
              />
            </div>
            <div>
              <div
                class="text-xs text-k-blue hover:text-k-blue-hover cursor-pointer"
                @click="toggleNFTDetails(flipperId)"
              >
                {{ $t('activity.nftDetails') }}
                <KIcon
                  :name="
                    isNFTDetailsOpen[flipperId]
                      ? 'i-mdi:chevron-down'
                      : 'i-mdi:chevron-right'
                  "
                />
              </div>
            </div>
          </div>
          <div v-if="isNFTDetailsOpen[flipperId]">
            <NFTsDetaislDropdown
              :flips="flips"
              variant="Flippers"
            />
          </div>
        </div>
        <hr class="my-3 mx-5">
      </div>
      <div ref="target" />
    </div>

    <div
      v-else
      class="flex justify-center items-center pt-6"
    >
      <div class="text-k-grey">
        {{ $t('activity.noFlips') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NFTsDetaislDropdown from './NFTsDetaislDropdown.vue'
import ProfileLink from '@/components/profile/ProfileLink.vue'
import { format } from '@/components/collection/activity/utils'

import type { Flippers } from '@/composables/collectionActivity/types'

const props = defineProps<{
  flippers?: Flippers
}>()
const target = ref<HTMLElement | null>(null)
const offset = ref(4)

const flippers = computed(() => Object.entries(props.flippers || {}))

const toggleNFTDetails = (flipperId: string) => {
  const isOpen = isNFTDetailsOpen.value[flipperId]
  isNFTDetailsOpen.value = {
    ...isNFTDetailsOpen.value,
    [flipperId]: !isOpen,
  }
}

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    offset.value += 4
  }
})

const displayedFlippers = computed(() => flippers.value.slice(0, offset.value))
// map of flipper id to boolean, is the NFT details section of that flipper open or nor
// {id0: false, id1: true, id3: false, ...}
const isFlipperMoreNFTSectionOpen = flippers.value.reduce(

  (accumelator, [flipperId, _]) => ({
    ...accumelator,
    [flipperId]: false,
  }),
  {},
)

const isNFTDetailsOpen = ref(isFlipperMoreNFTSectionOpen)
</script>

<style lang="scss" scoped>
.hide-last-hr:last-child > hr {
  display: none;
}
</style>
