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
            <b-button icon-right="ellipsis-v" class="is-neo" />
            <Sharing :label="$t('sharing.profile')" enable-download />
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

<style lang="scss">
.is-neo {
  border-radius: 0;
  background: hsl(0deg, 0%, 100%);
  border: 1px solid hsl(0deg, 0%, 4%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);

  &:hover {
    background: #ffe5f3 !important;
  }
}
</style>
