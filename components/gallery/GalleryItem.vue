<template>
  <div>
    <div class="columns">
      <div class="column is-one-third">
        <MediaObject
          :src="nftImage"
          :animation-src="nftAnimation"
          :mime-type="nftMimeType"
          :title="nft?.name"
          :original="true" />
      </div>
      <div class="column">
        <p>{{ nftImage }}</p>
        <p>{{ nftAnimation }}</p>
        <p>{{ nftMimeType }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from 'ohmyfetch'
import { MediaObject } from '@kodadot1/brick'

// import { tokenIdToRoute } from '@/components/unique/utils'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'

const { $consola } = useNuxtApp()
const nft = ref<NFT>()
const nftImage = ref()
const nftAnimation = ref()
const nftMimeType = ref()
const nftMetadata = ref<NFT['meta']>()

const { params } = useRoute()
// const { id: collectionID, item: id } = tokenIdToRoute(params.id)

const { data } = useGraphql({
  queryName: 'nftById',
  variables: {
    id: params.id,
  },
})

interface NFTData {
  nftEntity?: NFT
}

const fetchNFTMetadata = async (nftMeta) => {
  const nftMetaID = sanitizeIpfsUrl(nftMeta?.id)
  const data: NFTMetadata = await $fetch(nftMetaID)

  nftMetadata.value = data
  nftMimeType.value = data?.type

  if (data?.animation_url) {
    nftAnimation.value = sanitizeIpfsUrl(data.animation_url)
  }

  if (data?.image) {
    nftImage.value = sanitizeIpfsUrl(data.image)
  }
}

watch(data as unknown as NFTData, async (newData) => {
  const nftEntity = newData?.nftEntity
  const nftMeta = nftEntity?.meta

  if (nftEntity) {
    nft.value = nftEntity
  } else {
    $consola.log(`NFT with id ${params.id} not found. Fallback to RPC Node`)
  }

  if (nftMeta?.id) {
    await fetchNFTMetadata(nftMeta)
  }
})
</script>

<style scoped></style>
