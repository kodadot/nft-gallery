<template>
  <div v-if="nfts.length">
    <hr class="my-2" />
    <p class="has-text-grey is-size-7 mb-2">Recent NFTs</p>
    <div class="nfts is-flex is-justify-content-space-between">
      <MediaItem
        v-for="nft in nfts.slice(0, 3)"
        :key="nft.meta.id"
        :src="sanitizeIpfsUrl(nft.meta.image)"
        :mime-type="nft.type" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MediaItem } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { getNftMetadata } from '@/composables/useNft'

import type { NFTWithMetadata } from '@/composables/useNft'
import { getMimeType } from '~~/utils/gallery/media'

const { accountId } = useAuth()
const { client, urlPrefix } = usePrefix()

const queryPrefix = client.value === 'ksm' ? 'chain-ksm' : client.value
const { data } = useGraphql({
  queryPrefix,
  queryName: 'nftListWithSearch',
  variables: {
    first: 10,
    search: [
      {
        currentOwner_eq: accountId.value,
      },
    ],
  },
})

const nfts = ref<NFTWithMetadata[]>([])

watchEffect(() => {
  if (data.value?.nFTEntities) {
    const nftEntities = data.value.nFTEntities

    nftEntities.forEach(async (nft) => {
      const nftMetadata = await getNftMetadata(nft, urlPrefix.value)

      if (nftMetadata.meta.image) {
        const mimeType = await getMimeType(
          sanitizeIpfsUrl(nftMetadata.meta.image)
        )
        nfts.value.push({ ...nftMetadata, type: mimeType })
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.nfts {
  & > * {
    @include ktheme() {
      border: 1px solid theme('k-grey');
    }
    width: 30%;
  }
}
</style>
