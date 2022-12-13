<template>
  <section class="py-5 gallery-item">
    <div class="columns">
      <div class="column is-two-fifths">
        <MediaItem
          :key="nftImage"
          class="gallery-item-media"
          :src="nftImage"
          :animation-src="nftAnimation"
          :mime-type="nftMimeType"
          :title="nft?.name" />
      </div>
      <div class="column">
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between h-full">
          <!-- title section -->
          <div>
            <div class="is-flex is-justify-content-space-between">
              <div>
                <h1 class="title">{{ nft?.name }}</h1>
                <h2 class="subtitle">
                  <nuxt-link
                    :to="`/${urlPrefix}/collection/${nft?.collection.id}`"
                    class="has-text-link">
                    {{ nft?.collection.name }}
                  </nuxt-link>
                </h2>
              </div>
              <div class="buttons is-align-content-start">
                <GalleryItemShareBtn />
                <GalleryItemMoreActionBtn class="ml-4" />
              </div>
            </div>

            <div class="is-flex is-flex-direction-row is-flex-wrap-wrap py-4">
              <IdentityItem
                v-if="nft?.issuer"
                class="mb-1"
                label="Creator"
                :prefix="urlPrefix"
                :account="nft?.issuer" />
              <IdentityItem
                v-if="nft?.currentOwner !== nft?.issuer"
                label="Owner"
                :prefix="urlPrefix"
                :account="nft?.currentOwner || ''" />
            </div>
          </div>

          <!-- LINE DIVIDER -->
          <hr />

          <!-- price section -->
          <GalleryItemPrice />
        </div>
      </div>
    </div>

    <div class="columns mt-6">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column">
        <GalleryItemTabsPanel />
      </div>
    </div>

    <CarouselTypeRelated
      v-if="nft?.collection.id"
      class="mt-6"
      :collection-id="nft?.collection.id"
      data-cy="carousel-related" />

    <CarouselTypeVisited class="mt-6" />
  </section>
</template>

<script setup lang="ts">
import { IdentityItem, MediaItem } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'
import GalleryItemShareBtn from './GalleryItemShareBtn.vue'
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import GalleryItemPrice from './GalleryItemPrice/GalleryItemPrice.vue'

const { urlPrefix } = usePrefix()
const { nft, nftImage, nftAnimation, nftMimeType } = useGalleryItem()

const CarouselTypeRelated = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeRelated.vue')
)
const CarouselTypeVisited = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeVisited.vue')
)
</script>

<style lang="scss" scoped>
.gallery-item {
  font-family: 'Work Sans';
}
</style>
