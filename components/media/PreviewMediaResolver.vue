<template>
  <MediaResolver
    :src="properSrc"
    :mime-type="properType"
    :poster="poster"
    preview />
</template>

<script lang="ts" setup>
import { get, update } from 'idb-keyval'
import { $fetch } from 'ohmyfetch'

import { NFTMetadata } from '@/components/rmrk/service/scheme'

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
    const response = await $fetch(props.src, { method: 'HEAD' })
    type.value = response.type

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
