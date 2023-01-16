<template>
  <section class="py-5 gallery-item">
    <MessageNotify
      v-if="message || showCongratsMessage"
      :title="$t('mint.success')"
      :subtitle="$t('mint.successNewNfts')" />
    <div class="columns">
      <div class="column is-two-fifths">
        <MediaItem
          :key="nftImage"
          class="gallery-item-media"
          :src="nftImage"
          :animation-src="nftAnimation"
          :mime-type="nftMimeType"
          :title="nft?.name" />
      </div>
      <div class="column">
        <div
          class="is-flex is-flex-direction-column is-justify-content-space-between h-full">
          <!-- title section -->
          <div>
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
                <GalleryItemShareBtn />
                <GalleryItemMoreActionBtn class="ml-4" />
              </div>
            </div>

            <div class="is-flex is-flex-direction-row is-flex-wrap-wrap py-2">
              <IdentityItem
                v-if="nft?.issuer"
                class="gallery-avatar mr-4"
                :label="`${$t('Creator')}`"
                :prefix="urlPrefix"
                :account="nft?.issuer" />
              <IdentityItem
                v-if="nft?.currentOwner !== nft?.issuer"
                class="gallery-avatar"
                :label="`${$t('Owner')}`"
                :prefix="urlPrefix"
                :account="nft?.currentOwner || ''" />
            </div>
          </div>

          <!-- LINE DIVIDER -->
          <hr />

          <!-- price section -->
          <GalleryItemAction :nft="nft" @buy-success="onNFTBought" />
        </div>
      </div>
    </div>

    <div class="columns mt-6">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column gallery-item-tabs-panel-wrapper">
        <GalleryItemTabsPanel :active-tab="activeTab" />
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

import GalleryItemShareBtn from './GalleryItemShareBtn.vue'
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
import GalleryItemDescription from './GalleryItemDescription.vue'
import GalleryItemTabsPanel from './GalleryItemTabsPanel/GalleryItemTabsPanel.vue'
import GalleryItemAction from './GalleryItemAction/GalleryItemAction.vue'

import { exist } from '@/components/search/exist'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { generateNftImage } from '@/utils/seoImageGenerator'
import { formatBalanceEmptyOnZero } from '@/utils/format/balance'

const { urlPrefix } = usePrefix()
const { $seoMeta } = useNuxtApp()
const { nft, nftMetadata, nftImage, nftAnimation, nftMimeType } =
  useGalleryItem()
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
}
const route = useRoute()
const router = useRouter()
const message = ref('')

const CarouselTypeRelated = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeRelated.vue')
)
const CarouselTypeVisited = defineAsyncComponent(
  () => import('@/components/carousel/CarouselTypeVisited.vue')
)

onMounted(() => {
  exist(route.query.message, (val) => {
    message.value = val === 'congrats' ? val : ''
    router.replace({ query: { redesign: 'true' } })
  })
})

const title = computed(() => nft.value?.name)
const meta = computed(() => {
  return [
    ...$seoMeta({
      title: title.value,
      description: nftMetadata.value?.description,
      image: generateNftImage(
        nft.value?.name || '',
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

.gallery-item-tabs-panel-wrapper {
  margin-top: unset;
  height: 100%;
}

@media screen and (max-width: 768px) {
  .gallery-item-tabs-panel-wrapper {
    margin-top: 1.25rem;
  }
}
</style>
