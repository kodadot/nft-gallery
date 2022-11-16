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
            <b-dropdown aria-role="list" position="is-bottom-left">
              <template #trigger>
                <NeoButton label="Share" icon="share-square" />
              </template>

              <b-dropdown-item aria-role="listitem">Copy Link</b-dropdown-item>
              <b-dropdown-item aria-role="listitem">QR Code</b-dropdown-item>
              <b-dropdown-item aria-role="listitem"
                >Share On Twitter</b-dropdown-item
              >
            </b-dropdown>

            <b-dropdown aria-role="list" class="ml-4" position="is-bottom-left">
              <template #trigger>
                <NeoButton label="⋮" />
              </template>

              <b-dropdown-item aria-role="listitem">Download</b-dropdown-item>
              <b-dropdown-item aria-role="listitem" disabled
                >Report</b-dropdown-item
              >
            </b-dropdown>
            <!-- <Sharing :label="$t('sharing.profile')" enable-download /> -->
          </div>
        </div>

        <div class="is-flex is-flex-direction-row py-4">
          <IdentityItem
            v-if="nft?.issuer"
            label="Creator"
            :prefix="urlPrefix"
            :account="nft?.issuer" />
          <IdentityItem
            v-if="nft?.currentOwner"
            label="Owner"
            :prefix="urlPrefix"
            :account="nft?.currentOwner" />
        </div>

        <!-- LINE DIVIDER -->
        <hr />

        <!-- <p>{{ nft }}</p> -->
        <p>nftImage: {{ nftImage }}</p>
        <p>nftAnimation: {{ nftAnimation }}</p>
        <p>nftMimeType: {{ nftMimeType }}</p>
        <!-- <p>{{ nftMetadata }}</p> -->
      </div>
    </div>

    <div class="columns mt-6">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column">
        <GalleryItemActivity />
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
import { IdentityItem, MediaItem, NeoButton } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemActivity from './GalleryItemActivity.vue'

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
