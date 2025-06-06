<template>
  <section class="py-5 gallery-item">
    <div class="flex flex-col lg:flex-row">
      <div class="w-full lg:w-2/5 lg:pr-7 group">
        <div
          :id="CONTAINER_ID"
          ref="imgref"
          :class="{
            'relative': !isFullscreen,
            'fullscreen-fallback': isFallbackActive,
          }"
        >
          <NeoButton
            v-if="isFullscreen"
            class="back-button z-20"
            icon-left="chevron-left"
            @click="toggleFullscreen"
          >
            {{ $t('go back') }}
          </NeoButton>
          <BaseMediaItem
            :key="image"
            ref="mediaItemRef"
            class="gallery-item-media relative"
            :src="getMediaSrc(image)"
            :animation-src="nftAnimation"
            :mime-type="(nftAnimation && nftAnimationMimeType) || nftMimeType"
            :title="nftMetadata?.name"
            :is-fullscreen="isFullscreen"
            is-detail
            :is-lewd="galleryDescriptionRef?.isLewd"
            :placeholder="placeholder"
            :image-component="NuxtImg"
            :sizes="sizes"
            enable-normal-tag
            :audio-player-cover="image"
          />
        </div>
        <GalleryItemToolBar
          :container-id="CONTAINER_ID"
          @toggle="toggleFullscreen"
        />
      </div>

      <div class="w-full lg:w-3/5 lg:pl-5 py-7">
        <div class="flex flex-col justify-between h-full">
          <!-- title section -->
          <div class="pb-2">
            <div class="flex justify-between">
              <div class="name-container">
                <h1
                  class="title"
                  data-testid="item-title"
                >
                  {{ title }}
                  <span
                    v-if="nft?.burned"
                    class="text-k-red"
                  >「🔥」</span>
                </h1>
                <h2
                  class="subtitle"
                  data-testid="item-collection"
                >
                  <CollectionDetailsPopover
                    v-if="nft?.collection.id"
                    :collection="collection"
                    :nft="nft"
                  >
                    <template #content>
                      <nuxt-link
                        :to="`/${urlPrefix}/collection/${collection?.id}`"
                        class="text-k-blue hover:text-k-blue-hover"
                        data-testid="gallery-item-collection-link"
                      >
                        {{ collection?.name || collection?.id }}
                      </nuxt-link>
                    </template>
                  </CollectionDetailsPopover>
                </h2>
              </div>
              <GalleryItemButton v-if="!nft?.burned" />
            </div>

            <div
              class="text-neutral-7 flex items-center"
              :class="isMobile ? 'my-4' : 'my-6'"
            >
              <KIcon
                name="i-mdi:eye"
                class="mr-1"
              />
              <span v-if="pageViewCount === null">--</span>
              <span v-else>{{ formatNumber(pageViewCount) }}</span>
            </div>

            <div class="flex flex-row flex-wrap">
              <IdentityItem
                v-if="nftCreator"
                class="gallery-avatar"
                :class="isMobile ? 'mr-4' : 'mr-8'"
                :label="$t(nft?.dropCreator ? 'collectionCreator' : 'creator')"
                :prefix="urlPrefix"
                :account="nftCreator"
                data-testid="item-creator"
              />
              <IdentityItem
                v-if="nft?.currentOwner !== nftCreator"
                class="gallery-avatar"
                :label="$t('owner')"
                :prefix="urlPrefix"
                :account="nft?.currentOwner || ''"
                data-testid="item-owner"
              />
            </div>
          </div>

          <!-- LINE DIVIDER -->
          <hr>
          <template v-if="!nft?.burned">
            <UnlockableTag
              v-if="isUnlockable && isMobile"
              :nft="nft"
              :link="unlockLink"
              class="mt-4"
            />

            <!-- price section -->
            <GalleryItemHolderOf
              v-if="nft && isAssetHub"
              :nft="nft"
            />
            <GalleryItemAction
              :nft="nft"
              :highest-offer="nftHighestOffer"
            />
            <UnlockableTag
              v-if="isUnlockable && !isMobile"
              :link="unlockLink"
              :nft="nft"
              class="mt-7"
            />
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 mt-8 lg:pb-2">
      <div class="w-full lg:w-2/5 lg:pr-4">
        <GalleryItemDescription ref="galleryDescriptionRef" />
      </div>

      <div class="w-full lg:w-3/5 gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel :active-tab="activeTab" />
      </div>
    </div>

    <CarouselTypeRelated
      v-if="nft?.collection.id"
      class="mt-10"
      :collection-id="nft?.collection.id"
      data-testid="carousel-related"
    />

    <CarouselTypeVisited class="mt-10" />
  </section>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useFullscreen, useWindowSize } from '@vueuse/core'
import GalleryItemAction from './GalleryItemAction/GalleryItemAction.vue'
import GalleryItemButton from './GalleryItemButton/GalleryItemButton.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import UnlockableTag from './UnlockableTag.vue'
import { useGalleryItem } from './useGalleryItem'
import { GALLERY_ITEM_TABS } from '@/components/gallery/GalleryItemTabsPanel/types'
import CollectionDetailsPopover from '@/components/collectionDetailsPopover/CollectionDetailsPopover.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { formatBalanceEmptyOnZero, formatNumber } from '@/utils/format/balance'
import { resolveMedia, MediaType } from '@/utils/gallery/media'
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import { convertMarkdownToText } from '@/utils/markdown'
import { generateNftImage } from '@/utils/seoImageGenerator'

const CONTAINER_ID = 'nft-img-container'

const NuxtImg = resolveComponent('NuxtImg')

const { urlPrefix } = usePrefix()
const { isAssetHub } = useIsChain(urlPrefix)
const { placeholder } = useTheme()
const mediaItemRef = ref<{
  isLewdBlurredLayer: boolean
  toggleFullscreen
} | null>(null)
const galleryDescriptionRef = ref<{ isLewd: boolean } | null>(null)
const preferencesStore = usePreferencesStore()
const { getTriggerBuySuccess: triggerBuySuccess, getTriggerOfferSuccess: triggerOfferSuccess } = storeToRefs(preferencesStore)
const pageViewCount = usePageViews()
const fiatStore = useFiatStore()

const { getNft: nft, getNftMetadata: nftMetadata, getNftImage: nftImage, getNftMimeType: nftMimeType, getNftAnimation: nftAnimation, getNftAnimationMimeType: nftAnimationMimeType } = storeToRefs(useNftStore())

const { nftHighestOffer } = useGalleryItem()
const collection = computed(() => nft.value?.collection)

const nftCreator = computed(() => nft.value?.dropCreator || nft.value?.issuer)

const breakPointWidth = 930
const isMobile = computed(() => useWindowSize().width.value < breakPointWidth)

const activeTab = ref(GALLERY_ITEM_TABS.ACTIVITY)

const onNFTBought = () => {
  activeTab.value = GALLERY_ITEM_TABS.ACTIVITY
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

watch(triggerOfferSuccess, (value) => {
  if (value) {
    activeTab.value = GALLERY_ITEM_TABS.OFFERS
    preferencesStore.setTriggerOfferSuccess(false)
  }
})

const { isUnlockable, unlockLink } = useUnlockable(collection)

const title = computed(() =>
  nftMetadata.value?.name || nft.value?.name || '',
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

  return ''
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

function toggleMediaFullscreen() {
  if (!isSupported.value || fullScreenDisabled.value) {
    toggleFallback()
    return
  }
  toggle().catch(() => {
    fullScreenDisabled.value = true
    toggleFallback()
  })
}

function toggleFullscreen() {
  const mediaType = resolveMedia(nftAnimationMimeType.value)
  if ([MediaType.VIDEO].includes(mediaType)) {
    mediaItemRef.value?.toggleFullscreen()
  }
  else {
    toggleMediaFullscreen()
  }
}

function toggleFallback() {
  if (imgref.value) {
    const mainElement = document.querySelector('main')
    const isCurrentlyFullscreen = imgref.value.classList.toggle(
      'fullscreen-fallback',
    )
    mainElement?.classList.toggle('z-[unset]!')
    isFallbackActive.value = isCurrentlyFullscreen
    isFullscreen.value = isCurrentlyFullscreen
  }
}

onBeforeMount(() => fiatStore.fetchFiatPrice())
</script>

<style>
@reference '@/assets/css/tailwind.css';

#nft-img-container:fullscreen,
#nft-img-container.fullscreen-fallback {
  background-color: var(--background-color);

  .media-object {
    box-shadow: none;
    border: none;
  }

  img {
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
}
</style>

<style lang="scss" scoped>
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
  @apply fixed z-1 left-3 top-8 bulma-desktop:left-[2.5rem];
}

#nft-img-container.fullscreen-fallback {
  @apply fixed w-screen h-screen z-9999 left-0 top-0;
}

.fullscreen-button {
  @apply absolute z-2 hidden w-[35px] h-[35px] border border-solid right-11 top-8;
  background-color: rgba(var(--background-color), 0.15);
  border-color: rgba(var(--background-color), 0.3);
  color: var(--text-color);
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
      background: var(--background-color);
    }

    .o-car__indicator {
      &__item {
        @apply rounded-[50%];

        background: var(--background-color-inverse);
        border: var(--background-color-inverse);

        &--active {
          background: var(--k-primary);
          border: var(--k-primary);
        }
      }
    }
  }
}
</style>
