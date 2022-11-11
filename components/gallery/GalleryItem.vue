<template>
  <div>
    <div class="columns">
      <div class="column is-one-third">
        <MediaItem
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

    <div class="columns">
      <div class="column is-one-third">
        <o-tabs v-model="activeTab" expanded>
          <!-- <o-tab-item value="0" label="Properties">
            Lorem ipsum dolor sit amet.
          </o-tab-item> -->

          <o-tab-item value="1" label="Description" class="p-5">
            <div class="mb-3 is-flex">
              <span class="mr-2">Made By:</span>
              <a
                v-if="nft?.issuer"
                :href="`/${urlPrefix}/u/${nft?.issuer}`"
                target="_blank"
                rel="noodivener noreferrer"
                class="has-text-weight-bold">
                <Identity ref="identity" :address="nft?.issuer" />
              </a>
            </div>
            <div>{{ nftMetadata?.description }}</div>
          </o-tab-item>

          <o-tab-item value="2" label="Details" class="p-5">
            <div class="is-flex is-justify-content-space-between">
              <p>Contract Address</p>
              <p>--</p>
            </div>
            <div class="is-flex is-justify-content-space-between">
              <p>Creator</p>
              <a
                v-if="nft?.issuer"
                :href="`/${urlPrefix}/u/${nft?.issuer}`"
                target="_blank"
                rel="noodivener noreferrer"
                class="has-text-weight-bold">
                <Identity ref="identity" :address="nft?.issuer" />
              </a>
            </div>
            <div class="is-flex is-justify-content-space-between">
              <p>Blockchain</p>
              <p>{{ urlPrefix }}</p>
            </div>
            <div class="is-flex is-justify-content-space-between">
              <p>Token Standard</p>
              <p>--</p>
            </div>
            <div
              v-if="nft?.royalty"
              class="is-flex is-justify-content-space-between">
              <p>Royalties</p>
              <p>{{ nft?.royalty }}%</p>
            </div>
            <hr class="my-2" />
            <div class="is-flex is-justify-content-space-between">
              <p>Media</p>
              <p>{{ nftMimeType }}</p>
            </div>
            <div class="is-flex is-justify-content-space-between">
              <p>Metadata</p>
              <p>--</p>
            </div>
          </o-tab-item>
        </o-tabs>
      </div>

      <div class="column">
        <o-tabs v-model="activeTab2" expanded>
          <o-tab-item value="0" label="Offers" class="p-5"> Offers </o-tab-item>

          <o-tab-item value="1" label="Activity" class="p-5">
            Activity
          </o-tab-item>

          <o-tab-item value="2" label="Listings" class="p-5">
            Listings
          </o-tab-item>

          <o-tab-item value="3" label="Chart" class="p-5"> Chart </o-tab-item>
        </o-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from 'ohmyfetch'
import { OTabItem, OTabs } from '@oruga-ui/oruga'
import { MediaItem } from '@kodadot1/brick'

import Identity from '@/components/identity/IdentityIndex.vue'
// import { tokenIdToRoute } from '@/components/unique/utils'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { getMimeType } from '@/utils/gallery/media'

import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'

const { $consola } = useNuxtApp()
const activeTab = ref('1') // sample
const activeTab2 = ref('0') // sample
const nft = ref<NFT>()
const nftImage = ref()
const nftAnimation = ref()
const nftMimeType = ref()
const nftMetadata = ref<NFT['meta']>()

const { params } = useRoute()
// const { id: collectionID, item: id } = tokenIdToRoute(params.id)

const { urlPrefix } = usePrefix()
const { data } = useGraphql({
  queryName: urlPrefix.value === 'rmrk' ? 'nftByIdWithoutRoyalty' : 'nftById',
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
  console.log('metadata', data)

  nftMetadata.value = data

  if (data?.type) {
    nftMimeType.value = data?.type
  } else if (data?.animation_url) {
    nftMimeType.value = await getMimeType(sanitizeIpfsUrl(data.animation_url))
  }

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

  console.log(nftEntity)

  if (nftMeta?.id) {
    await fetchNFTMetadata(nftMeta)
  } else if (nftMeta === null && nftEntity?.metadata) {
    const meta = await $fetch(sanitizeIpfsUrl(nftEntity?.metadata))
    await fetchNFTMetadata({
      ...meta,
      id: nftEntity?.metadata,
    })
  }
})
</script>

<style scoped></style>
