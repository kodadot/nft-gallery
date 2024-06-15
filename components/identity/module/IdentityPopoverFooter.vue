<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div class="flex flex-row gap-1 items-center">
        <p class="text-base" data-testid="identity-created">
          {{ totalCreated }}
        </p>

        <span class="text-base text-neutral-7">{{
          $t('profile.creations')
        }}</span>
      </div>

      <div class="flex flex-row gap-1 items-center">
        <p class="text-base" data-testid="identity-followers">
          {{ followers }}
        </p>

        <span class="text-base text-neutral-7">{{
          $t('activity.followers')
        }}</span>
      </div>
    </div>

    <div v-if="soldItems.length" class="grid grid-cols-2 gap-5">
      <div v-for="nft in soldItems" :key="nft.id">
        <GalleryCard
          :id="nft.id"
          hide-name
          :metadata="nft.metadata"
          :current-owner="nft.currentOwner"
          :route="`/${urlPrefix}/gallery`"
          :data-testid="soldItems.indexOf(nft)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchFollowersOf } from '@/services/profile'
import useIdentityStats from '../utils/useIdentityStats'
import type { NFT } from '@/components/rmrk/service/scheme'
const GalleryCard = defineAsyncComponent(
  () => import('../../rmrk/Gallery/GalleryCard.vue'),
)

defineProps<{
  soldItems: NFT[]
}>()

const address = inject('address') as string
const { urlPrefix } = usePrefix()
const { totalCreated } = useIdentityStats({
  address,
})

const { data } = useAsyncData(() => fetchFollowersOf(address))
const followers = computed(() => data.value?.totalCount || 0)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.popover-user-heading {
  font-size: 12px;

  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
