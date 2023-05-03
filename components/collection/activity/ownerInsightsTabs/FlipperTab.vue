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
        class="hide-last-hr">
        <div class="is-flex is-flex-direction-column gap">
          <div class="px-5">
            <ProfileLink
              :address="flipperId"
              :avatar-size="35"
              class="has-text-weight-bold" />
            <div class="is-flex is-justify-content-space-between mt-2">
              <span class="is-size-7 has-text-grey">{{
                $t('activity.owned')
              }}</span>
              <span>{{ owned }}</span>
            </div>
            <div class="is-flex is-justify-content-space-between">
              <span class="is-size-7 has-text-grey">{{
                $t('activity.totalBought')
              }}</span>
              <CommonTokenMoney :value="totalBought" />
              {{ calculateUsdFromKsm(30, totalBought) }}
            </div>
            <div class="is-flex is-justify-content-space-between">
              <span class="is-size-7 has-text-grey">{{
                $t('activity.totalSold')
              }}</span>
              <CommonTokenMoney :value="totalsold" />
            </div>
            <div class="is-flex is-justify-content-space-between">
              <span class="is-size-7 has-text-grey">{{
                $t('activity.bestFlip')
              }}</span>
              <span
                :class="{
                  'has-text-k-green': bestFlip > 0,
                  'has-text-k-red': bestFlip < 0,
                }"
                >{{ bestFlip === 0 ? '--' : `${format(bestFlip)}%` }}</span
              >
            </div>
            <div class="is-flex is-justify-content-space-between">
              <span class="is-size-7 has-text-grey">{{
                $t('activity.latestActivity')
              }}</span>
              <span class="no-wrap">{{ timeAgo(latestflipTimestamp) }}</span>
            </div>
            <div>
              <div
                class="is-size-7 has-text-k-blue is-clickable"
                @click="toggleNFTDetails(flipperId)">
                {{ $t('activity.nftDetails') }}
                <NeoIcon
                  :icon="
                    isNFTDetailsOpen[flipperId]
                      ? 'chevron-down'
                      : 'chevron-right'
                  " />
              </div>
            </div>
          </div>
          <div v-if="isNFTDetailsOpen[flipperId]">
            <NFTsDetaislDropdown :flips="flips" variant="Flippers" />
          </div>
        </div>
        <hr class="my-3 mx-5" />
      </div>
      <div ref="target" />
    </div>

    <div
      v-else
      class="is-flex is-justify-content-center is-align-items-center pt-6">
      <div class="has-text-grey">
        {{ $t('activity.noFlips') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileLink from '@/components/rmrk/Profile/ProfileLink.vue'
import { NeoIcon } from '@kodadot1/brick'
import { format } from '@/components/collection/activity/utils'

import NFTsDetaislDropdown from './NFTsDetaislDropdown.vue'
import { timeAgo } from '@/components/collection/utils/timeAgo'
import { Flippers } from '@/composables/collectionActivity/types'
import { calculateUsdFromKsm } from '~~/utils/calculation'
import { useFiatStore } from '~~/stores/fiat'
const props = defineProps<{
  flippers?: Flippers
}>()
const target = ref<HTMLElement | null>(null)
const offset = ref(4)
const fiatStore = useFiatStore()

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
// map of flipper id to bolean, is the NFT details section of that flipper open or nor
// {id0: false, id1: true, id3: false, ...}
const isFlipperMoreNFTSectionOpen = flippers.value.reduce(
  (accumelator, [flipperId, _]) => ({
    ...accumelator,
    [flipperId]: false,
  }),
  {}
)

const usdValue = computed(() =>
  calculateUsdFromKsm(100000, fiatStore.getCurrentKSMValue as number)
)

const isNFTDetailsOpen = ref(isFlipperMoreNFTSectionOpen)
</script>

<style lang="scss" scoped>
.gap {
  gap: 0.5rem;
}
.hide-last-hr:last-child > hr {
  display: none;
}
</style>
