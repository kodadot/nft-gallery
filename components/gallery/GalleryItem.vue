<template>
  <section class="py-5 gallery-item">
    <div class="columns">
      <div class="column is-two-fifths">
        <MediaItem
          class="gallery-item-media"
          :src="nftImage"
          :animation-src="nftAnimation"
          :mime-type="nftMimeType"
          :title="nft?.name" />
      </div>
      <div class="column">
        <h1 class="title">{{ nft?.name }}</h1>
        <h2 class="subtitle">
          <nuxt-link :to="`/${urlPrefix}/collection/${nft?.collection.id}`">
            {{ nft?.collection.name }}
          </nuxt-link>
        </h2>

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
        <p>{{ nftImage }}</p>
        <p>{{ nftAnimation }}</p>
        <p>{{ nftMimeType }}</p>
        <p>{{ nftMetadata?.attributes }}</p>
      </div>
    </div>

    <div class="columns mt-6">
      <div class="column is-two-fifths">
        <o-tabs v-model="activeTab" expanded>
          <o-tab-item value="0" label="Properties" class="py-4">
            <table class="simple-table">
              <thead>
                <tr>
                  <td>Trait</td>
                  <td>Section</td>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="attribute in nftMetadata?.attributes"
                  :key="attribute.value">
                  <td>{{ attribute.value }}</td>
                  <td>{{ attribute.trait_type }}</td>
                </tr>
              </tbody>
            </table>
          </o-tab-item>

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

    <!-- TODO: show if item in collection is > 0 -->
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
import { OTabItem, OTabs } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { useGalleryItem } from './useGalleryItem'

const { urlPrefix } = usePrefix()
const { nft, nftImage, nftAnimation, nftMimeType, nftMetadata } =
  useGalleryItem()

const activeTab = ref('0') // sample
const activeTab2 = ref('0') // sample

const CarouselTypeRelated = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeRelated.vue')
)
const CarouselTypeVisited = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeVisited.vue')
)
</script>

<style scoped>
/* TODO: remove this class once redesign is done */
.gallery-item {
  font-family: 'Work Sans';
}
</style>
