<template>
  <div class="nft-card">
    <nuxt-link :to="`/${prefix}/gallery/${nft.id}`">
      <MediaItem
        :key="nft.image"
        class="nft-media"
        :src="nft.image"
        :animation-src="nft.animationUrl"
        :mime-type="nft.mimeType"
        :title="nft?.name" />
    </nuxt-link>
    <div class="nft-media-info">
      <div class="is-flex is-flex-direction-column">
        <span class="is-ellipsis has-text-weight-bold">{{ nft.name }}</span>

        <nuxt-link
          v-if="nft.collection.name && nft.collection.id"
          :title="nft.collectionName || nft.collection.name"
          :to="`/${prefix}/collection/${nft.collection.id}`"
          class="is-size-7 nft-info-collection-name">
          {{ nft.collection.name }}
        </nuxt-link>
      </div>

      <div
        class="is-flex is-align-items-center is-justify-content-space-between mt-2">
        <CommonTokenMoney v-if="showPrice" :value="nft.price" />
        <span class="chain-name">{{ prefix }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MediaItem from '../MediaItem/MediaItem.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import type { NFT } from '@/components/rmrk/service/scheme'

const props = defineProps<{
  nft?: NFT
  prefix: string
}>()

const showPrice = computed((): boolean => {
  return Number(props.nft?.price) > 0
})
</script>

<style lang="scss" scoped>
@import './NftCard.scss';
</style>
