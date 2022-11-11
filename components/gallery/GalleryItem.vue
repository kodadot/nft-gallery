<template>
  <section class="py-5">
    <div class="columns">
      <div class="column is-two-fiths">
        <MediaItem
          class="gallery-item-media"
          :src="nftImage"
          :animation-src="nftAnimation"
          :mime-type="nftMimeType"
          :title="nft?.name"
          original />
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

        {{ nft }}
        <p>{{ nftImage }}</p>
        <p>{{ nftAnimation }}</p>
        <p>{{ nftMimeType }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGalleryItem } from './useGalleryItem'
import { IdentityItem, MediaItem } from '@kodadot1/brick'

const { urlPrefix } = usePrefix()
const { nft, nftImage, nftAnimation, nftMimeType } = useGalleryItem()
</script>
