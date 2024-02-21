<template>
  <section class="py-5 gallery-item">
    <MessageNotify
      v-if="congratsNewNft"
      :title="$t('mint.success')"
      :subtitle="$t('mint.successCreateNewNft', [congratsNewNft])" />
    <div class="flex flex-col lg:flex-row">
      <div class="w-full lg:w-2/5 lg:pr-7">
        <div
          id="nft-img-container"
          ref="imgref"
          :class="{
            relative: !isFullscreen,
            'fullscreen-fallback': isFallbackActive,
          }">
          <!-- preview button -->
          <a
            v-if="
              canPreview &&
              !mediaItemRef?.isLewdBlurredLayer &&
              !hasAnimatedResources &&
              !isFullscreen
            "
            class="fullscreen-button justify-center items-center"
            @click="toggleFullscreen">
            <NeoIcon icon="expand" />
          </a>
          <NeoButton
            v-if="isFullscreen"
            class="back-button"
            @click="toggleFullscreen">
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
                <BaseMediaItem
                  :key="resource.src"
                  :src="getMediaSrc(resource.src)"
                  :mime-type="resource.mimeType"
                  :animation-src="resource.animation"
                  :audio-player-cover="galleryItem.nftImage.value"
                  :image-component="NuxtImg"
                  :is-fullscreen="isFullscreen"
                  :sizes="sizes"
                  is-detail />
              </NeoCarouselItem>
            </NeoCarousel>
          </div>
          <BaseMediaItem
            v-else
            :key="image"
            ref="mediaItemRef"
            class="gallery-item-media relative"
            :src="getMediaSrc(image)"
            :animation-src="nftAnimation"
            :mime-type="nftAnimationMimeType || nftMimeType"
            :title="nftMetadata?.name"
            :is-fullscreen="isFullscreen"
            is-detail
            :is-lewd="galleryDescriptionRef?.isLewd"
            :placeholder="placeholder"
            :image-component="NuxtImg"
            :sizes="sizes"
            :audio-player-cover="image" />
        </div>
      </div>

      <div class="w-full lg:w-3/5 lg:pl-5 py-7">
        <div class="flex flex-col justify-between h-full">
          <!-- title section -->
          <div class="pb-2">
            <div class="flex justify-between">
              <div class="name-container">
                <h1 class="title" data-testid="item-title">
                  {{ title }}
                  <span v-if="nft?.burned" class="text-k-red">「🔥」</span>
                </h1>
                <h2 class="subtitle" data-testid="item-collection">
                  <CollectionDetailsPopover
                    v-if="nft?.collection.id"
                    :collection="collection"
                    :nft="nft">
                    <template #content>
                      <nuxt-link
                        :to="`/${urlPrefix}/collection/${collection?.id}`"
                        class="text-k-blue hover:text-k-blue-hover"
                        data-testid="gallery-item-collection-link">
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
              class="text-neutral-7 flex items-center"
              :class="isMobile ? 'my-4' : 'my-6'">
              <NeoIcon pack="fasl" icon="eye" class="mr-1" />
              <span v-if="pageViewCount === null">--</span>
              <span v-else>{{ formatNumber(pageViewCount) }}</span>
            </div>

            <div class="flex flex-row flex-wrap">
              <IdentityItem
                v-if="nft?.issuer"
                class="gallery-avatar"
                :class="isMobile ? 'mr-4' : 'mr-8'"
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
            <GalleryItemHolderOf v-if="nft && isAssetHub" :nft="nft" />
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

    <div class="flex flex-col lg:flex-row gap-8 mt-8 lg:pb-2">
      <div class="w-full lg:w-2/5 lg:pr-4">
        <GalleryItemDescription
          ref="galleryDescriptionRef"
          :gallery-item="galleryItem" />
      </div>

      <div class="w-full lg:w-3/5 gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel
          :active-tab="activeTab"
          :gallery-item="galleryItem" />
      </div>
    </div>

    <CarouselTypeRelated
      v-if="nft?.collection.id"
      class="mt-10"
      :collection-id="nft?.collection.id"
      data-testid="carousel-related" />

    <CarouselTypeVisited class="mt-10" />
  </section>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoCarousel,
  NeoCarouselItem,
  NeoIcon,
} from '@kodadot1/brick'
import { useFullscreen, useWindowSize } from '@vueuse/core'

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
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero, formatNumber } from '@/utils/format/balance'
import { MediaType } from '@/components/rmrk/types'
import { resolveMedia } from '@/utils/gallery/media'
import UnlockableTag from './UnlockableTag.vue'
import { usePreferencesStore } from '@/stores/preferences'

const NuxtImg = resolveComponent('NuxtImg')

const { urlPrefix } = usePrefix()
const { isAssetHub } = useIsChain(urlPrefix)
const route = useRoute()
const router = useRouter()
const { placeholder } = useTheme()
const mediaItemRef = ref<{ isLewdBlurredLayer: boolean } | null>(null)
const galleryDescriptionRef = ref<{ isLewd: boolean } | null>(null)
const preferencesStore = usePreferencesStore()
const pageViewCount = usePageViews()

const galleryItem = useGalleryItem()
const {
  nft,
  nftMetadata,
  nftImage,
  nftAnimation,
  nftAnimationMimeType,
  nftMimeType,
  nftResources,
} = galleryItem
const collection = computed(() => nft.value?.collection)

const triggerBuySuccess = computed(() => preferencesStore.triggerBuySuccess)

const breakPointWidth = 930
const isMobile = computed(() => useWindowSize().width.value < breakPointWidth)

const tabs = {
  activity: '1',
  chart: '2',
}
const activeTab = ref(tabs.activity)

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

const image = computed(() => {
  if (!nftImage.value) {
    return sanitizeIpfsUrl(nft.value?.meta?.image)
  }

  return nftImage.value
})

const getMediaSrc = (src: string | undefined) =>
  src && isFullscreen.value ? toOriginalContentUrl(src) : src

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

const title = computed(() =>
  addSnSuffixName(
    nft.value?.name || nftMetadata.value?.name || '',
    nft.value?.sn,
  ),
)
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

const imgref = ref<HTMLElement | null>(null)
const isFallbackActive = ref(false)
const fullScreenDisabled = ref(false)
const { toggle, isFullscreen, isSupported } = useFullscreen(imgref)
const sizes = ref<string>('1000px')

watch(isFullscreen, (value) => {
  sizes.value = value ? 'original' : '1000px'
})

function toggleFullscreen() {
  if (!isSupported.value || fullScreenDisabled.value) {
    toggleFallback()
    return
  }
  toggle().catch(() => {
    fullScreenDisabled.value = true
    toggleFallback()
  })
}

function toggleFallback() {
  if (imgref.value) {
    const mainElement = document.querySelector('main')
    const isCurrentlyFullscreen = imgref.value.classList.toggle(
      'fullscreen-fallback',
    )
    mainElement?.classList.toggle('!z-[unset]')
    isFallbackActive.value = isCurrentlyFullscreen
    isFullscreen.value = isCurrentlyFullscreen
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';
#nft-img-container:fullscreen,
#nft-img-container.fullscreen-fallback {
  overflow: auto;
  @include ktheme() {
    background-color: theme('background-color');
  }
  .media-object {
    @include ktheme() {
      box-shadow: none;
      border: none;
    }
  }

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

.back-button {
  @apply fixed z-[1] left-3 top-8;
  @include desktop {
    left: $fluid-container-padding;
  }
}

#nft-img-container.fullscreen-fallback {
  @apply fixed w-screen h-screen z-[9999] left-0 top-0;
}

.fullscreen-button {
  @apply absolute z-[2] hidden w-[35px] h-[35px] border border-solid right-11 top-8;
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
        @apply rounded-[50%];

        @include ktheme() {
          background: theme('background-color-inverse');
          border: theme('background-color-inverse');
        }

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
