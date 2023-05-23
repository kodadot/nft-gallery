<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <img
      :src="src"
      class="is-block image-media__image"
      :alt="alt"
      data-cy="type-image"
      @error="onError" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'
import { getMimeType } from '@/utils/gallery/media'
import { getVideoThumbnail, store } from './utils'

const props = defineProps<{
  src?: string
  alt?: string
  original: boolean
  placeholder: string
  isDetail?: boolean
  isDarkMode?: boolean
}>()

const fallbackMedia = async (target) => {
  if (props.src) {
    const srcMimeType = await store.getItem(props.src + 'mimeType')
    const srcBase64 = await store.getItem(props.src + 'base64')

    let mimeType = srcMimeType || ''
    let base64 = srcBase64 || ''

    if (!srcMimeType) {
      mimeType = await getMimeType(props.src)
      await store.setItem(props.src + 'mimeType', mimeType)
    }

    if (mimeType.includes('video')) {
      if (!srcBase64) {
        base64 = (await getVideoThumbnail(props.src)) as string
        console.log('processing video')
        await store.setItem(props.src + 'base64', base64)
      }

      target.src = base64
    } else {
      target.src = props.placeholder
    }
  }
}

const onError = async (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    try {
      fallbackMedia(target)
    } catch {
      consola.log('[KODADOT::IMAGE] unable to load', e)
    }
  }
}
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: contain;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
