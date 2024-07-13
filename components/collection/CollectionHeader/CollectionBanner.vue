<template>
  <div
    class="collection-banner relative md:h-[560px] h-72 bg-no-repeat bg-cover bg-center border-b"
    :style="{ backgroundImage: `url(${bannerImageUrl})` }">
    <div class="collection-banner-shadow absolute inset-0"></div>

    <section class="h-full py-8">
      <div
        class="container is-fluid collection-banner-content flex flex-col md:flex-row items-start md:items-end md:justify-between h-full">
        <div class="lg:flex-1">
          <div class="flex flex-col items-start">
            <div class="collection-banner-avatar p-2.5 mb-4 md:mb-6">
              <BaseMediaItem
                :src="collectionAvatar"
                :image-component="NuxtImg"
                :title="collectionName"
                class="w-[5.5rem] h-[5.5rem] border" />
            </div>
            <h1
              class="collection-banner-name font-bold text-2xl md:text-[31px]"
              data-testid="collection-banner-name">
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
import type { NFTMetadata } from '@/components/rmrk/service/scheme'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import HeroButtons from '@/components/collection/HeroButtons.vue'
import { generateCollectionImage } from '@/utils/seoImageGenerator'
import { convertMarkdownToText } from '@/utils/markdown'
import collectionById from '@/queries/subsquid/general/collectionById.query'
const NuxtImg = resolveComponent('NuxtImg')

const collectionId = computed(() => route.params.id as string)
const route = useRoute()
const { client } = usePrefix()

const { data, refresh: refetch } = useAsyncQuery({
  query: collectionById,
  variables: {
    id: collectionId.value,
  },
  clientId: client.value,
})

const collectionAvatar = ref('')
const collectionName = ref('--')

const bannerImageUrl = computed(
  () => collectionAvatar.value && toOriginalContentUrl(collectionAvatar.value),
)

watch(collectionId, () => {
  refetch()
  collectionAvatar.value = ''
})

watchEffect(async () => {
  const collection = data.value?.collectionEntity
  const metadata = collection?.metadata
  const image = collection?.meta?.image
  const name = collection?.name

  if (image && name) {
    collectionAvatar.value = sanitizeIpfsUrl(image)
    collectionName.value = name
  } else {
    const meta = (await processSingleMetadata(
      metadata as string,
    )) as NFTMetadata
    const metaImage = sanitizeIpfsUrl(meta?.image)
    const metaName = meta?.name

    if (metaName) {
      collectionName.value = metaName
    }

    if (metaImage) {
      collectionAvatar.value = metaImage
    }
  }
})

useSeoMeta({
  title: collectionName,
  description: () =>
    convertMarkdownToText(data.value?.collectionEntity?.meta?.description),
  ogUrl: route.path,
  ogTitle: collectionName,
  ogDescription: () =>
    convertMarkdownToText(data.value?.collectionEntity?.meta?.description),
  ogImage: () =>
    generateCollectionImage(
      collectionName.value,
      data.value?.nftEntitiesConnection?.totalCount,
      collectionAvatar.value,
    ),
  twitterImage: () =>
    generateCollectionImage(
      collectionName.value,
      data.value?.nftEntitiesConnection?.totalCount,
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
