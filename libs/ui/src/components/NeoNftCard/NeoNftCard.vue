<template>
  <div
    class="nft-card"
    :class="{ loading: isLoading, 'nft-card__stacked': isStacked }">
    <component :is="link" v-if="!isLoading && nft" :[bindKey]="href">
      <img
        v-if="cardIcon && cardIconSrc"
        class="card-icon"
        :src="cardIconSrc"
        alt="Card Icon" />
      <div
        class="is-relative"
        :class="{ 'border border-stacked ml-5 mt-5 mr-2': isStacked }">
        <MediaItem
          :key="nft.image"
          class="nft-media"
          :class="{
            'stacked-shadow is-relative theme-background border border-stacked':
              isStacked,
          }"
          :src="nft.image"
          :animation-src="nft.animationUrl"
          :mime-type="nft.mimeType"
          :placeholder="placeholder"
          :title="nft?.name"
          :preview="mediaStaticVideo"
          :autoplay="autoplay"
          disable-operation
          :audio-player-cover="mediaPlayerCover"
          :audio-hover-on-cover-play="mediaHoverOnCoverPlay" />
        <div
          :class="[showActionOnHover ? 'show-on-hover' : 'show-always']"
          class="w-full is-flex is-justify-content-center action-container">
          <slot name="action" />
        </div>
      </div>
      <NFTMediaInfoStacked
        v-if="isStacked && !hideMediaInfo"
        :token="nft"
        :variant="variant"
        :prefix="prefix" />
      <NFTMediaInfo
        v-else-if="!hideMediaInfo"
        :nft="nft"
        :variant="variant"
        :prefix="prefix"
        :show-price="showPrice"
        :collection-popover-show-delay="collectionPopoverShowDelay" />
    </component>

    <template v-else>
      <div class="media-object nft-media">
        <div class="is-square image">
          <NeoSkeleton :rounded="false" full-size no-margin />
        </div>
      </div>
      <div class="nft-media-info" :class="`nft-media-info__${variant}`">
        <NeoSkeleton size="medium" no-margin />
        <div v-if="!isMinimal" class="is-flex mt-2">
          <NeoSkeleton
            size="small"
            position="centered"
            no-margin
            width="150px" />
        </div>
        <div class="is-flex mt-4">
          <NeoSkeleton size="small" no-margin width="100px" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NeoSkeleton, type NftCardVariant } from '@kodadot1/brick'
import type { ComputedOptions, ConcreteComponent, MethodOptions } from 'vue'

import MediaItem from '../MediaItem/MediaItem.vue'
import NFTMediaInfoStacked from './NFTMediaInfoStacked.vue'
import NFTMediaInfo from './NFTMediaInfo.vue'
import type { NeoNFT } from './types'

const props = withDefaults(
  defineProps<{
    isLoading?: boolean
    nft: NeoNFT
    prefix: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
    placeholder?: string
    cardIcon?: boolean
    cardIconSrc?: string
    link?:
      | string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
      | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>
    bindKey?: string
    showActionOnHover?: boolean
    mediaPlayerCover?: string
    mediaHoverOnCoverPlay?: boolean
    mediaStaticVideo?: boolean
    hideMediaInfo?: boolean
    linkTo?: string
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
    cardIconSrc: undefined,
    link: 'a',
    bindKey: 'href',
    showActionOnHover: true,
    placeholder: undefined,
    mediaPlayerCover: undefined,
    hideMediaInfo: false,
    linkTo: undefined,
  },
)

const href = computed(
  () => props.linkTo ?? `/${props.prefix}/gallery/${props.nft.id}`,
)

const isStacked = computed(() =>
  props.variant ? props.variant.includes('stacked') : false,
)
const isMinimal = props.variant.includes('minimal')
const autoplay = computed(() =>
  props.mediaStaticVideo === undefined ? undefined : !props.mediaStaticVideo,
)
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
