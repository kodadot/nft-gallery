<template>
  <div class="collection-card card" :class="{ loading: isLoading }">
    <nuxt-link
      v-if="!isLoading"
      :to="`/${urlPrefix}/collection/${collection.id}`">
      <BasicImage
        :src="image"
        :alt="collection.name"
        custom-class="collection-card__image-wrapper" />

      <CollectionDetail
        :nfts="collection.nfts || []"
        :name="collection.name || ''"
        :image="image" />
    </nuxt-link>

    <template v-else>
      <b-skeleton :rounded="false" height="112px" />
      <CollectionDetail :is-loading="true" :nfts="[]" name="" />
    </template>
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

interface Props {
  isLoading?: boolean
  collection: CollectionWithMeta
}

const props = defineProps<Props>()
const image = ref('')

onMounted(async () => {
  if (props.isLoading) {
    return
  }

  const metadata = (await processSingleMetadata(
    props.collection.metadata
  )) as Metadata
  image.value = sanitizeIpfsUrl(
    metadata.image || metadata.thumbnailUri || metadata.mediaUri || ''
  )
})
</script>
