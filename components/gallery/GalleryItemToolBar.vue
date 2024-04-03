<template>
  <div
    class="w-full xl:w-[465px] xl:ml-4 mr-4 mt-6 px-6 py-3 h-11 rounded-[43px] gap-8 flex justify-center border border-gray-400">
    <NeoTooltip :label="$t('reload')" position="top">
      <a no-shadow @click="handleReloadClick">
        <NeoIcon
          :icon="isLoading ? 'spinner-third' : 'arrow-rotate-left'"
          size="medium"
          :label="$t('reload')"
          :spin="isLoading" />
      </a>
    </NeoTooltip>
    <NeoTooltip :label="$t('fullscreen')" position="top">
      <a no-shadow @click="$emit('toggle')">
        <NeoIcon
          icon="arrow-up-right-and-arrow-down-left-from-center"
          size="medium" />
      </a>
    </NeoTooltip>
    <NeoTooltip :label="$t('newTab')" position="top">
      <a no-shadow @click="handleNewTab">
        <NeoIcon icon="arrow-up-right" size="medium" />
      </a>
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'
import { MediaType } from '@/components/rmrk/types'
import { determineElementType, resolveMedia } from '@/utils/gallery/media'

type ReloadElement =
  | HTMLIFrameElement
  | HTMLVideoElement
  | HTMLImageElement
  | null

const selectors: Record<
  Extract<
    MediaType,
    MediaType.IMAGE | MediaType.VIDEO | MediaType.OBJECT | MediaType.IFRAME
  >,
  string
> = {
  [MediaType.IMAGE]: 'img[data-nuxt-img]',
  [MediaType.VIDEO]: 'video',
  [MediaType.OBJECT]: 'object',
  [MediaType.IFRAME]: 'iframe[title="html-embed"]',
}

defineEmits(['toggle'])

const { nftAnimationMimeType, nftMimeType } = useGalleryItem()

const isLoading = ref(false)

const mediaAndImageType = computed(() => {
  const mediaType = resolveMedia(nftAnimationMimeType.value)
  const imageType = resolveMedia(nftMimeType.value)
  return { mediaType, imageType }
})

const reloadElement = (selector: string) => {
  setTimeout(() => {
    isLoading.value = false
    const element: ReloadElement = document.querySelector(selector)
    if (!element) {
      return
    }
    if (selectors[MediaType.IMAGE] === selector) {
      const timestamp = new Date().getTime()
      const url = new URL(element.src)
      url.searchParams.set('t', timestamp.toString())
      element.src = url.toString()
    } else {
      element.src += ''
    }
  }, 500)
}

const handleReloadClick = () => {
  isLoading.value = true

  const { mediaType, imageType } = mediaAndImageType.value
  const elementType = determineElementType(mediaType, imageType)

  return reloadElement(selectors[elementType])
}

const openInNewTab = (selector: string, attribute: string = 'src') => {
  const element = document.querySelector(selector)
  if (element) {
    const src = element.getAttribute(attribute)
    if (src) {
      window.open(src, '_blank')
    }
  }
}

const handleNewTab = () => {
  const { mediaType, imageType } = mediaAndImageType.value
  const elementType = determineElementType(mediaType, imageType)

  return openInNewTab(selectors[elementType])
}
</script>
