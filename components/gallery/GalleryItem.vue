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
          :original="isMobile && true" />
      </div>
      <div class="py-6 column">
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
              class="is-flex is-flex-direction-row is-flex-wrap-wrap py-4 pt-6">
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

          <!-- price section -->
          <GalleryItemAction :nft="nft" @buy-success="onNFTBought" />
        </div>
      </div>
    </div>

    <div class="columns is-variable is-6 mt-5">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column is-three-fifths gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel ref="tabsRef" :active-tab="activeTab" />
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
import { IdentityItem, MediaItem } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'

import GalleryItemButton from './GalleryItemButton/GalleryItemButton.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import GalleryItemAction from './GalleryItemAction/GalleryItemAction.vue'

import { exist } from '@/components/search/exist'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'
import { MediaType } from '@/components/rmrk/types'
import { resolveMedia } from '@/utils/gallery/media'

const { urlPrefix } = usePrefix()
const { $seoMeta } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const tabsRef = ref<InstanceType<typeof GalleryItemTabsPanel>>()

const { nft, nftMetadata, nftImage, nftAnimation, nftMimeType } =
  useGalleryItem()
const collection = computed(() => nft.value?.collection)
const isMobile = ref(window.innerWidth < 768)

const tabs = {
  offers: '0',
  activity: '1',
  chart: '2',
}
const activeTab = ref(tabs.offers)
const showCongratsMessage = ref(false)

const onNFTBought = () => {
  activeTab.value = tabs.activity
  showCongratsMessage.value = true
  tabsRef.value?.refreshActivityTab()
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

@media screen and (max-width: 930px) {
  .columns {
    display: inherit;
    & > .column {
      width: 100%;
    }
  }
}

.gallery-item-media image {
  margin-left: auto;
  margin-right: auto;
}

.h-audio {
  height: 70%;
}
</style>
