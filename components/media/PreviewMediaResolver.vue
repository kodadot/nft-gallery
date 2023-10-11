<template>
  <MediaItem :src="properSrc" :mime-type="properType" preview />
</template>

<script lang="ts" setup>
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { getMimeType } from '@/utils/gallery/media'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { MediaItem } from '@kodadot1/brick'

const props = defineProps({
  src: { type: String, default: '' },
  metadata: { type: String, default: '' },
  mimeType: { type: String, default: '' },
})

const type = ref('')

const properType = computed(() => props.mimeType || type.value || 'image/webp')
const properSrc = computed(() => props.src || '/placeholder.webp')

const fetchMimeType = async () => {
  if (props.mimeType) {
    return
  }

  const nftMetadata = await processSingleMetadata<NFTMetadata>(props.metadata)
  type.value = nftMetadata?.type || ''

  if (!type.value) {
    type.value = await getMimeType(props.src)
  }
}

onMounted(() => {
  fetchMimeType()
})
</script>
