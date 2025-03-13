<template>
  <div
    class="w-full xl:w-[465px] xl:ml-4 mr-4 mt-6 px-6 py-3 h-11 rounded-[43px] gap-4 flex justify-center border border-gray-400"
  >
    <NeoTooltip
      :label="$t('reload')"
      position="top"
    >
      <NeoButton
        variant="icon"
        no-shadow
        @click="handleReloadClick"
      >
        <KIcon
          :name="isLoading ? 'i-mdi:loading' : 'i-mdi:arrow-u-left-top'"
          size="medium"
          :label="$t('reload')"
          :spin="isLoading"
        />
      </NeoButton>
    </NeoTooltip>
    <NeoTooltip
      :label="$t('fullscreen')"
      position="top"
    >
      <NeoButton
        variant="icon"
        no-shadow
        @click="$emit('toggle')"
      >
        <KIcon
          name="i-mdi:arrow-top-right-bottom-left"
          size="medium"
        />
      </NeoButton>
    </NeoTooltip>
    <NeoTooltip
      :label="$t('newTab')"
      position="top"
    >
      <NeoButton
        v-if="disableNewTab"
        variant="icon"
        no-shadow
        @click="handleNewTab"
      >
        <KIcon
          name="i-mdi:arrow-top-right"
          size="medium"
        />
      </NeoButton>

      <KIcon
        v-else
        name="i-mdi:arrow-top-right"
        size="medium"
        class="text-k-grey"
      />
    </NeoTooltip>
    <NeoTooltip
      v-if="isDownloadEnabled"
      :label="$t('moreActions.download')"
      position="top"
    >
      <NeoButton
        variant="icon"
        data-testid="gallery-item-more-dropdown-download"
        no-shadow
        @click="downloadMedia"
      >
        <KIcon
          name="i-mdi:arrow-collapse-down"
          size="medium"
        />
      </NeoButton>
    </NeoTooltip>
  </div>
</template>

<script setup lang="ts">
import { NeoTooltip, NeoButton } from '@kodadot1/brick'

import {
  determineElementType,
  mediaTypeElementSelectors,
  resolveMedia,
  MediaType,
} from '@/utils/gallery/media'
import { downloadImage } from '@/utils/download'
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import { isMobileDevice } from '@/utils/extension'

type ReloadElement =
  | HTMLIFrameElement
  | HTMLVideoElement
  | HTMLImageElement
  | null

defineEmits(['toggle'])

const props = defineProps<{
  containerId: string
}>()

const { getNft: nft, getNftImage: nftImage, getNftMetadata: nftMetadata, getNftMimeType: nftMimeType, getNftAnimation: nftAnimation, getNftAnimationMimeType: nftAnimationMimeType } = storeToRefs(useNftStore())

const isLoading = ref(false)
const { toast } = useToast()
const { $i18n, $consola } = useNuxtApp()
const imageData = ref()

const image = computed(() => {
  if (!nftImage.value) {
    return sanitizeIpfsUrl(nft.value?.meta?.image)
  }

  return nftImage.value
})

const nftImageUrl = computed(() => nftMetadata.value?.image)

const isDownloadEnabled = computed(() => {
  const mimeType = nftMimeType.value
  return ((
    (mimeType?.includes('image') || mimeType?.includes('text/html'))
    && nftImageUrl.value) || imageData.value
  )
})

const downloadMedia = async () => {
  let imageUrl = sanitizeIpfsUrl(nftImageUrl.value)

  if (!imageUrl) {
    return
  }

  if (imageData.value) {
    const blob = await $fetch<Blob>(imageData.value)
    imageUrl = URL.createObjectURL(blob)
  }
  else if (nftMimeType.value?.includes('image')) {
    imageUrl = toOriginalContentUrl(imageUrl)
  }

  if (isMobileDevice) {
    toast($i18n.t('toast.downloadOnMobile'))
    setTimeout(() => {
      window.open(imageUrl, '_blank')
    }, 2000)
    return
  }

  try {
    toast($i18n.t('toast.downloadImage'))
    downloadImage(imageUrl, `${nft.value?.collection?.name}_${nft.value?.name}`)
  }
  catch (error) {
    $consola.warn('[ERR] unable to fetch image')
    toast($i18n.t('toast.downloadError'))
  }
}

const mediaAndImageType = computed(() => {
  const animationMediaType = resolveMedia(nftAnimationMimeType.value)
  const imageMediaType = resolveMedia(nftMimeType.value)
  return { animationMediaType, imageMediaType }
})

const getElementSelector = ({ imageMediaType, animationMediaType }) => {
  const elementType = determineElementType(animationMediaType, imageMediaType)
  return mediaTypeElementSelectors[elementType]
}

const reloadElement = (selector: string) => {
  setTimeout(() => {
    isLoading.value = false
    const element: ReloadElement = document.querySelector(selector)
    if (!element) {
      return
    }
    if (mediaTypeElementSelectors[MediaType.IMAGE] === selector) {
      const timestamp = new Date().getTime()
      const url = new URL(element.src)
      url.searchParams.set('t', timestamp.toString())
      element.src = url.toString()
    }
    else {
      element.src += ''
    }
  }, 500)
}

const handleReloadClick = () => {
  isLoading.value = true
  const { animationMediaType, imageMediaType } = mediaAndImageType.value

  return reloadElement(
    getElementSelector({ animationMediaType, imageMediaType }),
  )
}

const openInNewTab = (selector: string, attribute: string = 'src') => {
  const element = document.querySelector(`#${props.containerId} ${selector}`)
  if (element) {
    const src = element.getAttribute(attribute)
    if (src) {
      window.open(src, '_blank')
      return true
    }
  }
  return false
}

const handleNewTab = () => {
  const { animationMediaType, imageMediaType } = mediaAndImageType.value
  const elementSelector = getElementSelector({
    animationMediaType,
    imageMediaType,
  })

  if (!openInNewTab(elementSelector)) {
    window.open(nftAnimation.value || image.value, '_blank')
  }
}

const disableNewTab = computed(() => {
  if (nftAnimation.value && nftAnimationMimeType.value) {
    return true
  }

  return nftImage.value && nftMimeType.value
})

onKodahashRenderCompleted(({ payload }) => imageData.value = payload.image)
</script>
