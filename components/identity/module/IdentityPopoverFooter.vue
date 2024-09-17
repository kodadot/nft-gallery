<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div v-if="statsLoading">
        <NeoSkeleton
          width="100px"
          no-margin
        />
      </div>
      <div
        v-else
        class="flex flex-row gap-1 items-center"
      >
        <p
          class="text-base"
          data-testid="identity-created"
        >
          {{ totalCreated }}
        </p>

        <span class="text-base text-neutral-7">{{
          $t('profile.creations')
        }}</span>
      </div>

      <div v-if="followersLoading">
        <NeoSkeleton
          width="100px"
          no-margin
        />
      </div>
      <div
        v-else
        class="flex flex-row gap-1 items-center"
      >
        <p
          class="text-base"
          data-testid="identity-followers"
        >
          {{ followers }}
        </p>

        <span class="text-base text-neutral-7">{{
          $t('activity.followers')
        }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <template v-if="!nftEntities.length">
        <div
          v-for="skeleton in NFT_AMOUNT"
          :key="skeleton"
          class="aspect-square relative border border-border-color"
        >
          <NeoSkeleton
            :rounded="false"
            no-margin
            full-size
          />
        </div>
      </template>
      <template v-else>
        <div
          v-for="nft in nftEntities"
          :key="nft.id"
        >
          <GalleryCard
            :id="nft.id"
            hide-name
            :metadata="nft.metadata"
            :current-owner="nft.currentOwner"
            :route="`/${urlPrefix}/gallery`"
            :data-testid="nftEntities.indexOf(nft)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import useIdentityStats from '../utils/useIdentityStats'
import { fetchFollowersOf } from '@/services/profile'
import type { NFT } from '@/components/rmrk/service/scheme'

const GalleryCard = defineAsyncComponent(
  () => import('../../rmrk/Gallery/GalleryCard.vue'),
)

const NFT_AMOUNT = 2

const address = inject('address') as ComputedRef<string>

const { urlPrefix } = usePrefix()
const { totalCreated, loading: statsLoading } = useIdentityStats({
  address,
})

const {
  data: followersData,
  refresh,
  pending: followersLoading,
} = useAsyncData(`followers-${address.value}`, () =>
  fetchFollowersOf(address.value),
)

const followers = computed(() => followersData.value?.totalCount || 0)

const { data } = useSearchNfts({
  search: [
    {
      AND: [
        {
          OR: [
            {
              // created
              issuer_eq: address.value,
            },
            {
              // bought
              issuer_not_eq: address.value,
              currentOwner_eq: address.value,
            },
          ],
        },
        {
          burned_eq: false,
        },
      ],
    },
  ],
  first: NFT_AMOUNT,
  orderBy: 'updatedAt_DESC',
})

const nftEntities = computed<NFT[]>(() => data.value?.nFTEntities ?? [])

defineExpose({ refresh })
</script>
