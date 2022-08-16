<template>
  <MediaResolver
    :src="properSrc"
    :mime-type="properType"
    :poster="poster"
    preview />
</template>

<script lang="ts" setup>
import { get, update } from 'idb-keyval'

import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { getMimeType } from '@/utils/gallery/media'

const MediaResolver = defineAsyncComponent(
  () => import('@/components/media/MediaResolver.vue')
)

const props = defineProps({
  src: { type: String, default: '' },
  metadata: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  poster: { type: String, default: '' },
})

const type = ref('')

const properType = computed(() => props.mimeType || type.value || 'image/webp')
const properSrc = computed(() => props.src || '/placeholder.webp')

const fetchMimeType = async () => {
  if (props.mimeType) {
    return
  }

  const nftMetadata = await get<NFTMetadata>(props.metadata)
  type.value = nftMetadata?.type || ''

  if (!type.value) {
    type.value = await getMimeType(props.src)

    update(props.metadata, (cached) => ({
      ...(cached || {}),
      type: type.value,
    }))
  }
}

onMounted(() => {
  fetchMimeType()
})
</script>
