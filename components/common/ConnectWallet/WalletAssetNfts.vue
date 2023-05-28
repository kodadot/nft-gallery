<template>
  <div v-if="nfts.length">
    <hr class="my-2" />
    <p class="has-text-grey is-size-7 mb-2">Recent NFTs</p>
    <div class="nfts is-flex is-justify-content-space-between">
      <MediaItem
        v-for="nft in nfts"
        :key="nft.meta.id"
        :src="sanitizeIpfsUrl(nft.meta.image)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MediaItem } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { NFTWithMetadata } from '@/composables/useNft'

const { accountId } = useAuth()

const { data } = useGraphql({
  queryPrefix: 'subsquid',
  queryName: 'nftListWithSearch',
  variables: {
    first: 3,
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
    nfts.value = data.value.nFTEntities
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
