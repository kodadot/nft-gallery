<template>
  <div ref="mediaItem" class="h-fit">
    <component
      :is="resolveComponent"
      :src="properSrc"
      :sizes="sizes"
      :animation-src="animationSrc"
      :alt="title"
      :placeholder="placeholder"
      :original="original"
      :is-lewd="isLewd"
      :is-detail="isDetail"
      :disable-operation="disableOperation"
      :player-cover="audioPlayerCover"
      :hover-on-cover-play="audioHoverOnCoverPlay"
      :parent-hovering="isMediaItemHovering"
      :image-component="imageComponent"
      :preview="preview"
      :autoplay="autoplay" />
    <div
      v-if="isLewd && isLewdBlurredLayer"
      class="backdrop-blur-3xl absolute top-0 w-full h-full text-text-color capitalize flex items-center justify-center flex-col px-2">
      <NeoIcon icon="eye-slash" class="mb-3" />
      <span class="font-bold">
        {{ $t('lewd.explicit') }}
      </span>
      <span class="text-center max-w-xs">{{ $t('lewd.explicitDesc') }}</span>
    </div>
    <div
      v-if="isInteractive"
      class="w-6 h-6 absolute top-3 right-3 flex items-center justify-center rounded-full bg-k-shade border-default border-k-grey">
      <NeoIcon icon="code" pack="far" class="font-medium text-xs/none" />
    </div>
    <NeoButton
      v-if="isLewd"
      rounded
      no-shadow
      class="absolute left-1/2 bottom-5 -translate-x-1/2 text-text-color bg-background-color border-none px-4 py-1 text-base"
      :class="{ 'text-background-color bg-text-color': isLewdBlurredLayer }"
      :label="
        isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent')
      "
      @click="toggleContent" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useElementHover, useElementVisibility } from '@vueuse/core'
import { NeoButton, NeoIcon } from '@kodadot1/brick'

import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import { MediaType } from '@/components/rmrk/types'
import ImageMedia from './type/ImageMedia.vue'
import VideoMedia from './type/VideoMedia.vue'
import AudioMedia from './type/AudioMedia.vue'
import JsonMedia from './type/JsonMedia.vue'
import IFrameMedia from './type/IFrameMedia.vue'
import ObjectMedia from './type/ObjectMedia.vue'
import Media from './type/UnknownMedia.vue'

import type { ImageComponent } from '../TheImage/TheImage.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    animationSrc?: string
    mimeType?: string
    title?: string
    original?: boolean
    isLewd?: boolean
    isDetail?: boolean
    placeholder?: string
    disableOperation?: boolean
    audioPlayerCover?: string
    audioHoverOnCoverPlay?: boolean
    // props for video component
    preview?: boolean
    autoplay?: boolean
    // props for image component
    sizes?: string
    imageComponent?: ImageComponent
  }>(),
  {
    src: '',
    animationSrc: '',
    mimeType: '',
    title: 'KodaDot NFT',
    original: false,
    isLewd: false,
    isDetail: false,
    placeholder: './Koda.svg',
    disableOperation: undefined,
    audioPlayerCover: '',
    imageComponent: 'img',
  },
)

const mediaItem = ref<HTMLDivElement>()

// props.mimeType may be empty string "". Add `image/png` as fallback
const mimeType = computed(() => props.mimeType || type.value || 'image/png')

const sizes = computed(() =>
  props.sizes === 'original' ? undefined : props.sizes,
)

const targetIsVisible = useElementVisibility(mediaItem)
const modelComponent = ref<Component>()
const isModelComponentLoaded = ref(false)
const shouldLoadModelComponent = computed(() => {
  return targetIsVisible.value && mimeType.value === 'model/gltf-binary'
})
watch(shouldLoadModelComponent, (shouldLoad) => {
  if (shouldLoad && !isModelComponentLoaded.value) {
    modelComponent.value = defineAsyncComponent(
      () => import('./type/ModelMedia.vue'),
    )
    isModelComponentLoaded.value = true
  }
})

const SUFFIX = 'Media'

const isInteractive = computed(() => {
  return resolveMedia(mimeType.value) === MediaType.IFRAME && !props.isDetail
})
const type = ref('')

const isLewdBlurredLayer = ref(props.isLewd)
const components = {
  ImageMedia,
  VideoMedia,
  AudioMedia,
  JsonMedia,
  IFrameMedia,
  ObjectMedia,
  Media,
}

const resolveComponent = computed(() => {
  let mediaType = resolveMedia(mimeType.value)

  if (mediaType === MediaType.IFRAME && !props.isDetail) {
    mediaType = MediaType.IMAGE
  }

  return mediaType === 'Model'
    ? modelComponent.value
    : components[mediaType + SUFFIX]
})

const properSrc = computed(() => props.src || props.placeholder)

const updateComponent = async () => {
  if (props.animationSrc && !props.mimeType) {
    type.value = await getMimeType(props.animationSrc)
  }
}

watch(
  () => props.animationSrc,
  () => updateComponent(),
  {
    immediate: true,
  },
)

const toggleContent = () => {
  isLewdBlurredLayer.value = !isLewdBlurredLayer.value
}

const isMediaItemHovering = useElementHover(mediaItem)

defineExpose({ isLewdBlurredLayer })
</script>
