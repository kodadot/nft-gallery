<template>
  <section class="py-5 gallery-item">
    <MessageNotify
      v-if="congratsNewNft"
      :title="$t('mint.success')"
      :subtitle="$t('mint.successCreateNewNft', [congratsNewNft])" />
    <div class="columns is-variable is-6">
      <div class="column is-two-fifths">
        <div id="nft-img-container" ref="imgref" class="is-relative">
          <!-- preview button -->
          <a
            v-if="
              canPreview &&
              !mediaItemRef?.isLewdBlurredLayer &&
              !hasAnimatedResources &&
              !isFullscreen
            "
            class="fullscreen-button is-justify-content-center is-align-items-center"
            @click="toggle">
            <NeoIcon icon="expand" />
          </a>
          <NeoButton v-if="isFullscreen" class="back-button" @click="toggle">
            <NeoIcon icon="chevron-left" />
            {{ $t('go back') }}
          </NeoButton>
          <!-- media item -->
          <div v-if="hasResources" class="gallery-item-carousel">
            <NeoCarousel
              v-model="activeCarousel"
              indicators-class="mt-4"
              indicator-item-class="mx-1">
              <NeoCarouselItem
                v-for="resource in nftResources"
                :key="resource.id">
                <MediaItem
                  :key="resource.src"
                  :src="resource.src"
                  :mime-type="resource.mimeType"
                  :animation-src="resource.animation"
                  :audio-player-cover="galleryItem.nftImage.value"
                  is-detail />
              </NeoCarouselItem>
            </NeoCarousel>
          </div>
          <MediaItem
            v-else
            :key="nftImage"
            ref="mediaItemRef"
            class="gallery-item-media is-relative"
            :src="nftImage"
            :animation-src="nftAnimation"
            :mime-type="nftMimeType"
            :title="nftMetadata?.name"
            is-detail
            :is-lewd="galleryDescriptionRef?.isLewd"
            :placeholder="placeholder"
            :audio-player-cover="nftImage" />
        </div>
      </div>

      <div class="py-8 column">
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between h-full">
          <!-- title section -->
          <div class="pb-4">
            <div class="is-flex is-justify-content-space-between">
              <div class="name-container">
                <h1 class="title" data-testid="item-title">
                  {{ nftMetadata?.name }}
                  <span v-if="nft?.burned" class="has-text-danger">「🔥」</span>
                </h1>
                <h2 class="subtitle" data-testid="item-collection">
                  <CollectionDetailsPopover
                    v-if="nft?.collection.id"
                    :nft="nft">
                    <template #content>
                      <nuxt-link
                        :to="`/${urlPrefix}/collection/${collection?.id}`"
                        class="has-text-link">
                        {{ collection?.name || collection?.id }}
                      </nuxt-link>
                    </template>
                  </CollectionDetailsPopover>
                </h2>
              </div>
              <GalleryItemButton
                v-if="!nft?.burned"
                :gallery-item="galleryItem" />
            </div>

            <div
              class="is-flex is-flex-direction-row is-flex-wrap-wrap py-4 pt-8">
              <IdentityItem
                v-if="nft?.issuer"
                class="gallery-avatar mr-4"
                :label="$t('creator')"
                :prefix="urlPrefix"
                :account="nft?.issuer"
                data-testid="item-creator" />
              <IdentityItem
                v-if="nft?.currentOwner !== nft?.issuer"
                class="gallery-avatar"
                :label="$t('owner')"
                :prefix="urlPrefix"
                :account="nft?.currentOwner || ''"
                data-testid="item-owner" />
            </div>
          </div>

          <!-- LINE DIVIDER -->
          <hr />
          <template v-if="!nft?.burned">
            <UnlockableTag
              v-if="isUnlockable && isMobile"
              :nft="nft"
              :link="unlockLink"
              class="mt-4" />

            <!-- price section -->
            <GalleryItemAction :nft="nft" />
            <UnlockableTag
              v-if="isUnlockable && !isMobile"
              :link="unlockLink"
              :nft="nft"
              class="mt-7" />
          </template>
        </div>
      </div>
    </div>

    <div class="columns is-variable is-6 mt-5">
      <div class="column is-two-fifths">
        <GalleryItemDescription
          ref="galleryDescriptionRef"
          :gallery-item="galleryItem" />
      </div>

      <div class="column is-three-fifths gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel
          :active-tab="activeTab"
          :gallery-item="galleryItem" />
      </div>
    </div>

    <CarouselTypeRelated
      v-if="nft?.collection.id"
      class="mt-8"
      :collection-id="nft?.collection.id"
      data-testid="carousel-related" />

    <CarouselTypeVisited class="mt-8" />
  </section>
</template>

<script setup lang="ts">
import {
  MediaItem,
  NeoButton,
  NeoCarousel,
  NeoCarouselItem,
  NeoIcon,
} from '@kodadot1/brick'
import { useFullscreen } from '@vueuse/core'

import { useGalleryItem } from './useGalleryItem'

import CarouselTypeRelated from '@/components/carousel/CarouselTypeRelated.vue'
import CarouselTypeVisited from '@/components/carousel/CarouselTypeVisited.vue'
import CollectionDetailsPopover from '@/components/collectionDetailsPopover/CollectionDetailsPopover.vue'

import GalleryItemButton from './GalleryItemButton/GalleryItemButton.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import GalleryItemAction from './GalleryItemAction/GalleryItemAction.vue'
import { convertMarkdownToText } from '@/utils/markdown'
import { exist } from '@/utils/exist'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'
import { MediaType } from '@/components/rmrk/types'
import { resolveMedia } from '@/utils/gallery/media'
import UnlockableTag from './UnlockableTag.vue'
import { useWindowSize } from '@vueuse/core'
import { usePreferencesStore } from '@/stores/preferences'

const { urlPrefix } = usePrefix()
const route = useRoute()
const router = useRouter()
const { placeholder } = useTheme()
const mediaItemRef = ref<{ isLewdBlurredLayer: boolean } | null>(null)
const galleryDescriptionRef = ref<{ isLewd: boolean } | null>(null)
const preferencesStore = usePreferencesStore()

const galleryItem = useGalleryItem()
const { nft, nftMetadata, nftImage, nftAnimation, nftMimeType, nftResources } =
  galleryItem
const collection = computed(() => nft.value?.collection)

const triggerBuySuccess = computed(() => preferencesStore.triggerBuySuccess)

const breakPointWidth = 930
const isMobile = computed(() => useWindowSize().width.value < breakPointWidth)

const tabs = {
  offers: '0',
  activity: '1',
  chart: '2',
}
const activeTab = ref(tabs.offers)

// const isFullscreen = ref(false)
const canPreview = computed(() =>
  [MediaType.VIDEO, MediaType.IMAGE, MediaType.OBJECT].includes(
    resolveMedia(nftMimeType.value),
  ),
)

const activeCarousel = ref(0)

const hasResources = computed(
  () => nftResources.value && nftResources.value?.length > 1,
)
const hasAnimatedResources = computed(
  () =>
    nftResources.value &&
    nftResources.value?.length > 1 &&
    nftResources.value[1].animation,
)

const onNFTBought = () => {
  activeTab.value = tabs.activity
}

watch(triggerBuySuccess, (value, oldValue) => {
  if (value && !oldValue) {
    onNFTBought()
    preferencesStore.setTriggerBuySuccess(false)
  }
})

const congratsNewNft = ref('')

onMounted(() => {
  exist(route.query.congratsNft as string, (val) => {
    congratsNewNft.value = val || ''
    router.replace({ query: {} })
  })
})

const { isUnlockable, unlockLink } = useUnlockable(collection)

const title = computed(() => nftMetadata.value?.name || '')
const seoDescription = computed(
  () => convertMarkdownToText(nftMetadata.value?.description) || '',
)
const seoCard = computed(() => {
  if (nft.value) {
    return generateNftImage(
      title.value,
      formatBalanceEmptyOnZero(nft.value?.price as string),
      sanitizeIpfsUrl(nftImage.value || ''),
      nftMimeType.value,
    )
  }
})

useSeoMeta({
  title,
  description: seoDescription,
  ogTitle: title,
  ogDescription: seoDescription,
  ogImage: seoCard,
  twitterImage: seoCard,
  twitterCard: 'summary_large_image',
})

const imgref = ref(null)
const { toggle, isFullscreen } = useFullscreen(imgref)
</script>

<style lang="scss">
#nft-img-container:fullscreen {
  background-color: #fff;
  img {
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
$break-point-width: 930px;
.title {
  font-size: 2.4375em;
}

.name-container {
  max-width: 75%;
}

.gallery-item-tabs-panel-wrapper {
  margin-top: unset;
  height: 100%;
}

@media screen and (max-width: 768px) {
  .gallery-item-tabs-panel-wrapper {
    margin-top: 1.25rem;
  }
}

@media screen and (min-width: 769px) and (max-width: $break-point-width) {
  .columns {
    display: inherit;
    & > .column {
      width: 100%;
    }
  }
}
.back-button {
  position: absolute;
  left: 0.75rem;
  top: 2rem;
  z-index: 99;
  @include desktop {
    left: $fluid-container-padding;
  }
}
.fullscreen-button {
  position: absolute;
  right: 2.75rem;
  top: 2rem;
  z-index: 2;
  display: none;
  width: 35px;
  height: 35px;
  border: 1px solid;
  @include ktheme() {
    background-color: rgba(theme('background-color'), 0.15);
    border-color: rgba(theme('background-color'), 0.3);
    color: theme('text-color');
  }
}

.column > div:hover .fullscreen-button {
  display: flex;
}

@media screen and (max-width: $break-point-width) {
  .fullscreen-button {
    display: flex;
  }
}

@media (hover: none) {
  .fullscreen-button {
    display: flex;
  }
}

.h-audio {
  height: 70%;
}

.gallery-item-carousel {
  :deep(.o-car) {
    .o-car__item {
      overflow: hidden;
    }

    .o-car__overlay {
      @include ktheme() {
        background: theme('background-color');
      }
    }

    .o-car__indicator {
      &__item {
        @include ktheme() {
          background: theme('background-color-inverse');
          border: theme('background-color-inverse');
        }
        border-radius: 50%;

        &--active {
          @include ktheme() {
            background: theme('k-primary');
            border: theme('k-primary');
          }
        }
      }
    }
  }
}
</style>
