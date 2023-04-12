<template>
  <div class="collection-card card">
    <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
      <BasicImage
        :src="image"
        :alt="collection.name"
        custom-class="collection-card__image-wrapper" />

      <CollectionDetail
        :nfts="collection.nfts || []"
        :name="collection.name || ''"
        :image="image" />
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { CollectionWithMeta } from '@/components/rmrk/service/scheme'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import CollectionDetail from './CollectionDetail.vue'

import type { Metadata } from '@/components/rmrk/service/scheme'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  collection: CollectionWithMeta
}>()

const image = ref('')

onMounted(async () => {
  const metadata = (await processSingleMetadata(
    props.collection.metadata
  )) as Metadata
  image.value = sanitizeIpfsUrl(
    metadata.image || metadata.thumbnailUri || metadata.mediaUri || ''
  )
})
</script>
