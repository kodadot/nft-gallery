<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  defineProps,
  onMounted,
  ref,
} from '#app'
import { get, update } from 'idb-keyval'
import axios from 'axios'

import { NFTMetadata } from '@/components/rmrk/service/scheme'

const MediaResolver = defineAsyncComponent(
  () => import('@/components/media/MediaResolver.vue')
)

const props = defineProps({
  src: { type: String, default: '' },
  metadata: { type: String, default: '' },
  mimeType: String,
  poster: String,
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
    const { headers } = await axios.head(props.src)
    type.value = headers['content-type']
    update(props.metadata, (cached) => ({
      ...(cached || {}),
      type: type.value,
    }))
  }
}

onMounted(fetchMimeType)
</script>

<template>
  <MediaResolver
    :src="properSrc"
    :mimeType="properType"
    :poster="poster"
    preview />
</template>
