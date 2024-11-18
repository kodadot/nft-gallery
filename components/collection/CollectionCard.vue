<template>
  <div
    class="collection-card card"
    :class="{ loading: isLoading }"
  >
    <nuxt-link
      v-if="!isLoading && collection && !isLoadingMeta"
      :to="`/${urlPrefix}/collection/${collection.id}`"
    >
      <BasicImage
        :src="banner"
        :alt="collection.name"
        :lazy="lazyLoading"
        sizes="300px md:350px"
        custom-class="collection-card__image-wrapper"
      />

      <CollectionDetail
        :nfts="collection.nfts || []"
        :name="collection.name || ''"
        :image="image"
        :lazy-loading="lazyLoading"
      />
    </nuxt-link>

    <template v-else>
      <NeoSkeleton
        no-margin
        :rounded="false"
        height="112px"
      />
      <CollectionDetail
        is-loading
        :nfts="[]"
        name=""
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
import type { CollectionMetadata } from '@kodadot1/hyperdata'
import CollectionDetail from './CollectionDetail.vue'
import type { CollectionWithMeta } from '@/types'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const props = defineProps<{
  isLoading?: boolean
  collection?: CollectionWithMeta
  lazyLoading?: boolean
}>()

const isLoadingMeta = ref(false)
const image = ref('')
const banner = ref('')

const { urlPrefix } = usePrefix()

const getImageFromMetadata = async (collectionMetadata: string) => {
  isLoadingMeta.value = true

  const metadata = await processSingleMetadata<CollectionMetadata>(collectionMetadata)

  const metadataImage = getCollectionImage(metadata) || ''
  const metadataBanner = metadata.banner || metadataImage

  image.value = sanitizeIpfsUrl(metadataImage)
  banner.value = sanitizeIpfsUrl(metadataBanner)

  isLoadingMeta.value = false
}

onMounted(async () => {
  if (props.isLoading || !props.collection) {
    return
  }

  const meta = props.collection.meta
  const metaImage = meta ? getCollectionImage(meta) : undefined
  const metaBanner = meta?.banner || metaImage

  if (metaImage && metaBanner) {
    image.value = sanitizeIpfsUrl(metaImage)
    banner.value = sanitizeIpfsUrl(metaBanner)
  }
  else {
    getImageFromMetadata(props.collection.metadata)
  }
})
</script>
