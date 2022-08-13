<template>
  <MediaResolver
    :src="properSrc"
    :mimeType="properType"
    :poster="poster"
    preview />
</template>

<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  useLazyFetch,
  watch,
} from '#app'
import { get, update } from 'idb-keyval'

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
const { data: item } = useLazyFetch(props.src, {
  method: 'HEAD',
})

const properType = computed(() => props.mimeType || type.value || 'image/webp')
const properSrc = computed(() => props.src || '/placeholder.webp')

const fetchMimeType = async () => {
  if (props.mimeType) {
    return
  }

  const nftMetadata = await get<NFTMetadata>(props.metadata)
  type.value = nftMetadata?.type || ''

  if (!type.value && item.value) {
    type.value = (item.value as Blob)?.type || ''

    update(props.metadata, (cached) => ({
      ...(cached || {}),
      type: type.value,
    }))
  }
}

onMounted(() => {
  fetchMimeType()
})

watch(item, () => {
  fetchMimeType()
})
</script>
