<template>
  <div v-if="nfts.length">
    <hr class="my-4" />
    <p class="has-text-grey is-size-7 mb-2">Recent NFTs</p>
    <div class="nfts">
      <NuxtLink
        v-for="nft in nfts"
        :key="nft?.id"
        :to="`/${urlPrefix}/gallery/${nft?.id}`">
        <BaseMediaItem
          :src="sanitizeIpfsUrl(nft?.meta.image)"
          :mime-type="nft?.type" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getNftMetadata } from '@/composables/useNft'
import { getMimeType } from '@/utils/gallery/media'

import type { NFTWithMetadata } from '@/composables/useNft'

const { accountId } = useAuth()
const { urlPrefix } = usePrefix()

const { data } = useSearchNfts({
  search: [
    {
      currentOwner_eq: accountId.value,
    },
  ],
  first: 3,
  orderBy: 'updatedAt_DESC',
})

const nfts = ref<NFTWithMetadata[]>([])

watchEffect(() => {
  if (data.value?.nFTEntities) {
    const nftEntities = data.value.nFTEntities

    nftEntities.forEach(async (nft, index) => {
      const nftMetadata = await getNftMetadata(nft, urlPrefix.value)

      if (nftMetadata.meta.image) {
        const mimeType = await getMimeType(
          sanitizeIpfsUrl(nftMetadata.meta.image),
        )
        nfts.value[index] = { ...nftMetadata, type: mimeType }
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.nfts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  & > * {
    @include ktheme() {
      border: 1px solid theme('k-grey');

      &:hover {
        border-color: theme('border-color');
        opacity: 0.85;
      }
    }
  }
}
</style>
