<template>
  <div
    class="collection-banner relative md:h-[560px] h-72 bg-no-repeat bg-cover bg-center border-b"
    :style="{ backgroundImage: `url(${collectionBanner})` }"
  >
    <div class="collection-banner-shadow absolute inset-0" />

    <section class="h-full py-8">
      <div
        class="container is-fluid collection-banner-content flex flex-col md:flex-row items-start md:items-end md:justify-between h-full"
      >
        <div class="lg:flex-1">
          <div class="flex flex-col items-start">
            <div class="collection-banner-avatar p-2.5 mb-4 md:mb-6">
              <BaseMediaItem
                :src="collectionAvatar"
                :image-component="NuxtImg"
                :title="collectionName"
                class="w-[5.5rem] h-[5.5rem] border"
              />
            </div>
            <h1
              class="collection-banner-name font-bold text-2xl md:text-[31px] w-max max-w-sm"
              data-testid="collection-banner-name"
            >
              {{ collectionName }}
            </h1>
          </div>
        </div>

        <!-- related active drop -->
        <CollectionRelatedDropNotification :collection-id="collectionId" />

        <HeroButtons class="is-hidden-mobile self-end lg:flex-1" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { NFTMetadata } from '@/types'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import HeroButtons from '@/components/collection/HeroButtons.vue'
import { generateCollectionImage } from '@/utils/seoImageGenerator'
import { convertMarkdownToText } from '@/utils/markdown'

const NuxtImg = resolveComponent('NuxtImg')

const props = defineProps<{
  collectionId: string
  collection?: unknown
}>()

const route = useRoute()

const collectionAvatar = ref('')
const collectionBanner = ref('')
const collectionName = ref('--')

watch(() => props.collectionId, () => {
  collectionAvatar.value = ''
  collectionBanner.value = ''
  collectionName.value = '--'
})

watchEffect(async () => {
  const collection = props.collection
  const metadata = collection?.metadata
  const image = collection?.meta?.image
  const banner = collection?.meta?.banner || image
  const name = collection?.name

  if (image && name && banner) {
    collectionAvatar.value = sanitizeIpfsUrl(image)
    collectionBanner.value = toOriginalContentUrl(sanitizeIpfsUrl(banner))
    collectionName.value = name
  }
  else {
    const meta = (await processSingleMetadata(
      metadata as string,
    )) as NFTMetadata
    const metaImage = sanitizeIpfsUrl(meta?.image)
    const metaBanner = meta?.banner ? sanitizeIpfsUrl(meta?.banner) : metaImage
    const metaName = meta?.name

    if (metaName) {
      collectionName.value = metaName
    }

    if (metaBanner) {
      collectionBanner.value = toOriginalContentUrl(metaBanner)
    }

    if (metaImage) {
      collectionAvatar.value = metaImage
    }
  }
})

useSeoMeta({
  title: collectionName,
  description: () =>
    convertMarkdownToText(props.collection?.meta?.description),
  ogUrl: route.path,
  ogTitle: collectionName,
  ogDescription: () =>
    convertMarkdownToText(props.collection?.meta?.description),
  ogImage: () =>
    generateCollectionImage(
      collectionName.value,
      props.collection?.nftCount,
      collectionAvatar.value,
    ),
  twitterImage: () =>
    generateCollectionImage(
      collectionName.value,
      props.collection?.nftCount,
      collectionAvatar.value,
    ),
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.collection-banner {
  &-shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.2));
  }

  &-avatar {
    @include ktheme() {
      border: 1px solid theme('border-color');
      background-color: theme('background-color');
      box-shadow: theme('primary-shadow');
    }
  }

  &-name {
    @include ktheme() {
      color: theme('text-color-inverse');
      text-shadow:
        1px 1px 0 theme('text-color'),
        1px -1px 0 theme('text-color'),
        -1px 1px 0 theme('text-color'),
        -1px -1px 0 theme('text-color'),
        1px 0px 0 theme('text-color'),
        0px 1px 0 theme('text-color'),
        -1px 0px 0 theme('text-color'),
        0px -1px 0 theme('text-color'),
        4px 4px theme('text-color');
    }
  }
}
</style>
