<template>
  <div
    class="collection-banner"
    :style="{ backgroundImage: `url(${bannerImageUrl})` }">
    <div class="collection-banner-shadow"></div>

    <section class="h-full py-8">
      <div class="container is-fluid collection-banner-content">
        <div class="lg:flex-1">
          <div class="flex flex-col items-start">
            <div class="collection-banner-avatar">
              <NuxtImg
                v-if="collectionAvatar"
                height="88"
                densities="2x"
                :src="collectionAvatar"
                class="object-fit-cover"
                :alt="collectionName" />
              <img v-else :src="placeholder" alt="image placeholder" />
            </div>
            <h1
              class="collection-banner-name"
              data-testid="collection-banner-name">
              {{ collectionName }}
            </h1>
          </div>
        </div>

        <!-- migration is ready -->
        <div v-if="isMigrate">
          <div
            class="rounded-full border justify-between items-center px-4 bg-background-color hidden lg:flex">
            <div class="flex items-center">
              <img
                width="42"
                height="42"
                src="/migrate/state-ready.svg"
                alt="unlockable icon" />
              <span> {{ $t('migrate.ready.title') }} </span>
            </div>
            <div class="w-4 h-[1px] bg-separator-line-color mx-2" />
            <nuxt-link
              class="flex items-center has-text-weight-bold my-2"
              to="/migrate">
              {{ $t('migrate.cta') }}
            </nuxt-link>
          </div>
        </div>

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
import { useReadyItems } from '@/composables/useMigrate'

const collectionId = computed(() => route.params.id)
const route = useRoute()
const { placeholder } = useTheme()
const { entities } = useReadyItems()

const { data, refetch } = useGraphql({
  queryName: 'collectionById',
  variables: {
    id: collectionId.value,
  },
})

const collectionAvatar = ref('')
const collectionName = ref('--')
const isMigrate = ref(false)

const bannerImageUrl = computed(
  () => collectionAvatar.value && toOriginalContentUrl(collectionAvatar.value),
)

watch(collectionId, () => {
  refetch({
    id: collectionId.value,
  })
  collectionAvatar.value = ''
})

watchEffect(async () => {
  const collection = data.value?.collectionEntity
  const metadata = collection?.metadata
  const image = collection?.meta?.image
  const name = collection?.name

  isMigrate.value = entities[collectionId.value.toString()]?.name

  if (image && name) {
    collectionAvatar.value = sanitizeIpfsUrl(image)
    collectionName.value = name
  } else {
    const meta = (await processSingleMetadata(metadata)) as NFTMetadata
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
    convertMarkdownToText(data.value?.collectionEntity.meta?.description),
  ogUrl: route.path,
  ogTitle: collectionName,
  ogDescription: () =>
    convertMarkdownToText(data.value?.collectionEntity.meta?.description),
  ogImage: () =>
    generateCollectionImage(
      collectionName.value,
      data.value?.nftEntitiesConnection.totalCount,
      collectionAvatar.value,
    ),
  twitterImage: () =>
    generateCollectionImage(
      collectionName.value,
      data.value?.nftEntitiesConnection.totalCount,
      collectionAvatar.value,
    ),
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.collection-banner {
  background-repeat: no-repeat;
  background-size: cover;
  height: 560px;
  position: relative;
  background-position: 50% 50%;
  @apply border-b;

  &-shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.2));
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;

    @include mobile {
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
    }
  }

  &-avatar {
    padding: 0.625rem;

    @include ktheme() {
      border: 1px solid theme('border-color');
      background-color: theme('background-color');
      box-shadow: theme('primary-shadow');
    }

    img {
      display: block;
      width: 5.5rem;
      height: 5.5rem;
      border: 1px solid;
    }
  }

  &-name {
    font-weight: 700;
    font-size: 2rem;
    margin-top: 1.5rem;

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
