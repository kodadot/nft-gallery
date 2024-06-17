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

    <div v-if="nftEntities.length" class="grid grid-cols-2 gap-5">
      <div v-for="nft in nftEntities" :key="nft.id">
        <GalleryCard
          :id="nft.id"
          hide-name
          :metadata="nft.metadata"
          :current-owner="nft.currentOwner"
          :route="`/${urlPrefix}/gallery`"
          :data-testid="nftEntities.indexOf(nft)" />
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

const address = inject('address') as string

const { urlPrefix } = usePrefix()
const { totalCreated } = useIdentityStats({
  address,
})

const { data: followersData } = useAsyncData(() => fetchFollowersOf(address))
const followers = computed(() => followersData.value?.totalCount || 0)

const { data } = useSearchNfts({
  search: [
    {
      burned_eq: false,
      OR: [
        {
          issuer_eq: address,
        },
        {
          issuer_not_eq: address,
          currentOwner_eq: address,
        },
      ],
    },
  ],
  first: 2,
  orderBy: 'updatedAt_DESC',
})

const nftEntities = computed<NFT[]>(() => data.value?.nFTEntities ?? [])
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
