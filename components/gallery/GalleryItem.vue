<template>
  <section class="py-5 gallery-item">
    <MessageNotify
      v-if="congratsNewNft"
      :title="$t('mint.success')"
      :subtitle="$t('mint.successCreateNewNft', [congratsNewNft])" />
    <MessageNotify
      v-else-if="showCongratsMessage"
      :title="$t('mint.success')"
      :subtitle="$t('mint.successNewNfts')" />
    <div class="columns is-variable is-6">
      <div class="column is-two-fifths">
        <div class="is-relative">
          <a
            v-if="canPreview"
            class="fullscreen-button is-justify-content-center is-align-items-center"
            @click="isFullscreen = true">
            <NeoIcon icon="expand" />
          </a>
          <MediaItem
            :key="nftImage"
            :class="{
              'is-flex is-align-items-center is-justify-content-center h-audio':
                resolveMedia(nftMimeType) == MediaType.AUDIO,
            }"
            class="gallery-item-media"
            :src="nftImage"
            :animation-src="nftAnimation"
            :mime-type="nftMimeType"
            :title="nftMetadata?.name"
            is-detail
            :original="isMobile"
            :placeholder="placeholder" />
        </div>
      </div>
      <div class="py-8 column">
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between h-full">
          <!-- title section -->
          <div class="pb-4">
            <div class="is-flex is-justify-content-space-between">
              <div class="name-container">
                <h1 class="title" data-cy="item-title">
                  {{ nftMetadata?.name }}
                </h1>
                <h2 class="subtitle" data-cy="item-collection">
                  <CollectionDetailsPopover
                    v-if="nft?.collection.id"
                    :nft="nft">
                    <template #trigger>
                      <nuxt-link
                        :to="`/${urlPrefix}/collection/${collection?.id}`"
                        class="has-text-link">
                        {{ collection?.name || collection?.id }}
                      </nuxt-link>
                    </template>
                  </CollectionDetailsPopover>
                </h2>
              </div>
              <GalleryItemButton />
            </div>

            <div
              class="is-flex is-flex-direction-row is-flex-wrap-wrap py-4 pt-8">
              <IdentityItem
                v-if="nft?.issuer"
                class="gallery-avatar mr-4"
                :label="$t('Creator')"
                :prefix="urlPrefix"
                :account="nft?.issuer"
                data-cy="item-creator" />
              <IdentityItem
                v-if="nft?.currentOwner !== nft?.issuer"
                class="gallery-avatar"
                :label="$t('Owner')"
                :prefix="urlPrefix"
                :account="nft?.currentOwner || ''"
                data-cy="item-owner" />
            </div>
          </div>

          <!-- LINE DIVIDER -->
          <hr />
          <UnlockableTag
            v-if="isUnlockable && isMobile"
            :nft="nft"
            class="mt-4" />

          <!-- price section -->
          <GalleryItemAction :nft="nft" @buy-success="onNFTBought" />
          <UnlockableTag
            v-if="isUnlockable && !isMobile"
            :nft="nft"
            class="mt-7" />
        </div>
      </div>
    </div>

    <div class="columns is-variable is-6 mt-5">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column is-three-fifths gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel :active-tab="activeTab" />
      </div>
    </div>

    <CarouselTypeRelated
      v-if="nft?.collection.id"
      class="mt-8"
      :collection-id="nft?.collection.id"
      data-cy="carousel-related" />

    <CarouselTypeVisited class="mt-8" />
    <GalleryItemPreviewer v-model="isFullscreen" />
  </section>
</template>

<script setup lang="ts">
import { IdentityItem, MediaItem, NeoIcon } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'

import GalleryItemButton from './GalleryItemButton/GalleryItemButton.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import GalleryItemAction from './GalleryItemAction/GalleryItemAction.vue'
import GalleryItemPreviewer from './GalleryItemPreviewer.vue'

import { exist } from '@/components/search/exist'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'
import { MediaType } from '@/components/rmrk/types'
import { resolveMedia } from '@/utils/gallery/media'
import UnlockableTag from './UnlockableTag.vue'
import { useWindowSize } from '@vueuse/core'

const { urlPrefix } = usePrefix()
const { $seoMeta } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { placeholder } = useTheme()

const { nft, nftMetadata, nftImage, nftAnimation, nftMimeType } =
  useGalleryItem()
const collection = computed(() => nft.value?.collection)

const breakPointWidth = 930
const isMobile = computed(() => useWindowSize().width.value < breakPointWidth)

const tabs = {
  offers: '0',
  activity: '1',
  chart: '2',
}
const activeTab = ref(tabs.offers)
const showCongratsMessage = ref(false)

const isFullscreen = ref(false)
const canPreview = computed(() =>
  [MediaType.VIDEO, MediaType.IMAGE, MediaType.OBJECT].includes(
    resolveMedia(nftMimeType.value)
  )
)

const onNFTBought = () => {
  activeTab.value = tabs.activity
  showCongratsMessage.value = true
}
const congratsNewNft = ref('')

const CarouselTypeRelated = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeRelated.vue')
)
const CarouselTypeVisited = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeVisited.vue')
)
const CollectionDetailsPopover = defineAsyncComponent(
  () =>
    import('@/components/collectionDetailsPopover/CollectionDetailsPopover.vue')
)

onMounted(() => {
  exist(route.query.congratsNft, (val) => {
    congratsNewNft.value = val ? val : ''
    router.replace({ query: {} })
  })
})

const isUnlockable = computed(() => route.query.unlockable === 'true')

const title = computed(() => nftMetadata.value?.name || '')
const meta = computed(() => {
  return [
    ...$seoMeta({
      title: title.value,
      description: nftMetadata.value?.description,
      image: generateNftImage(
        title.value,
        formatBalanceEmptyOnZero(nft.value?.price as string),
        sanitizeIpfsUrl(nftImage.value || ''),
        nftMimeType.value
      ),
      mime: nftMimeType.value,
      url: route.path,
      video: sanitizeIpfsUrl(nftAnimation.value || ''),
    }),
  ]
})

useNuxt2Meta({
  title,
  meta,
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
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

.fullscreen-button {
  position: absolute;
  right: 2.75rem;
  top: 2rem;
  z-index: 1;
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
</style>
