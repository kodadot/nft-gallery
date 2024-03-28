<template>
  <div class="toolbar">
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
import { resolveMedia } from '@/utils/gallery/media'

type ReloadElement =
  | HTMLIFrameElement
  | HTMLVideoElement
  | HTMLImageElement
  | null

const isLoading = ref(false)
defineEmits(['toggle'])

const galleryItem = useGalleryItem()

const { nftAnimationMimeType, nftMimeType } = galleryItem

function handleReloadClick() {
  isLoading.value = true

  const reloadElement = (selector: string, isImage?: boolean) => {
    setTimeout(() => {
      isLoading.value = false
      const element: ReloadElement = document.querySelector(selector)
      if (element) {
        if (isImage) {
          const timestamp = new Date().getTime()
          const url = new URL(element.src)
          url.searchParams.set('t', timestamp.toString())
          element.src = url.toString()
        } else {
          element.src += ''
        }
      }
    }, 500)
  }

  const mediaType = resolveMedia(nftAnimationMimeType.value)
  const imageType = resolveMedia(nftMimeType.value)

  if ([MediaType.IFRAME].includes(mediaType)) {
    reloadElement('iframe[title="html-embed"]')
  } else if ([MediaType.VIDEO].includes(mediaType)) {
    reloadElement('video')
  } else if ([MediaType.OBJECT].includes(mediaType)) {
    reloadElement('object')
  } else if ([MediaType.IMAGE].includes(imageType)) {
    reloadElement('img[data-nuxt-img]', true)
  }
}

function handleNewTab() {
  const openInNewTab = (selector: string, attribute: string) => {
    const element = document.querySelector(selector)
    if (element) {
      const src = element.getAttribute(attribute)
      if (src) {
        window.open(src, '_blank')
      }
    }
  }

  const mediaType = resolveMedia(nftAnimationMimeType.value)
  const imageType = resolveMedia(nftMimeType.value)

  if ([MediaType.IFRAME].includes(mediaType)) {
    openInNewTab('iframe[title="html-embed"]', 'src')
  } else if ([MediaType.VIDEO].includes(mediaType)) {
    openInNewTab('video', 'src')
  } else if ([MediaType.OBJECT].includes(mediaType)) {
    openInNewTab('object', 'src')
  } else if ([MediaType.IMAGE].includes(imageType)) {
    openInNewTab('img[data-nuxt-img]', 'src')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.toolbar {
  @apply w-full xl:w-[465px] xl:ml-4 mr-4 mt-6 px-6 py-3 h-11 rounded-[43px] gap-8 flex justify-center border border-gray-400;
}
</style>
