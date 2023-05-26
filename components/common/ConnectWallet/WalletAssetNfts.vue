<template>
  <div v-if="nfts.length">
    <hr class="my-2" />
    <p class="has-text-grey is-size-7 mb-2">Recent NFTs</p>
    <div class="nfts">
      <MediaItem
        v-for="nft in nfts"
        :key="nft.meta.id"
        :src="sanitizeIpfsUrl(nft.meta.image)"
        original />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIdentityStore } from '@/stores/identity'
import { MediaItem } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { NFTWithMetadata } from '@/composables/useNft'

const identityStore = useIdentityStore()

const { data } = useGraphql({
  queryPrefix: 'subsquid',
  queryName: 'nftListWithSearch',
  variables: {
    first: 3,
    search: [
      {
        currentOwner_eq: identityStore.getAuthAddress,
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
  display: flex;
  justify-content: space-between;

  & > * {
    @include ktheme() {
      border: 1px solid theme('k-grey');
    }
    width: 30%;
  }
}
</style>
