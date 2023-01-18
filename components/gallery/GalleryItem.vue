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
                <h1 class="title" data-cy="item-title">{{ nft?.name }}</h1>
                <h2 class="subtitle" data-cy="item-collection">
                  <CollectionDetailsPopover
                    v-if="nft?.collection.id"
                    :nft="nft">
                    <template #trigger>
                      <nuxt-link
                        :to="`/${urlPrefix}/collection/${nft?.collection.id}`"
                        class="has-text-link">
                        {{ nft?.collection.name }}
                      </nuxt-link>
                    </template>
                  </CollectionDetailsPopover>
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
                :account="nft?.issuer"
                data-cy="item-creator" />
              <IdentityItem
                v-if="nft?.currentOwner !== nft?.issuer"
                class="gallery-avatar"
                :label="`${$t('Owner')}`"
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

    <div class="columns mt-6">
      <div class="column is-two-fifths">
        <GalleryItemDescription />
      </div>

      <div class="column mobile-top-margin">
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
const route = useRoute()
const router = useRouter()

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
const message = ref('')

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

.mobile-top-margin {
  margin-top: unset;
}

@media screen and (max-width: 768px) {
  .mobile-top-margin {
    margin-top: 1.25rem;
  }
}
</style>
