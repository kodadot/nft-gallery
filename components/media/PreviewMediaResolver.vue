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

const {
  src = '',
  metadata = '',
  mimeType,
  poster,
} = defineProps<{
  src?: string
  metadata?: string
  mimeType?: string
  poster?: string
}>()

const type = ref('')

const properType = computed(() => mimeType || type.value || 'image/webp')
const properSrc = computed(() => src || '/placeholder.webp')

const fetchMimeType = async () => {
  if (mimeType) {
    return
  }

  const m = await get<NFTMetadata>(metadata)
  type.value = m?.type || ''
  if (!type.value) {
    const { headers } = await axios.head(src)
    type.value = headers['content-type']
    update(metadata, (cached) => ({
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
