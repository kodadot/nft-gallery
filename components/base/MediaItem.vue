<template>
  <div
    ref="mediaItem"
    class="media-object h-fit"
    :class="{ relative: hasNormalTag }"
  >
    <component
      :is="resolveComponent"
      ref="mediaRef"
      :src="properSrc"
      :sizes="sizes"
      :mime-type="mimeType"
      :animation-src="animationSrc"
      :alt="title"
      :placeholder="placeholder"
      :original="original"
      :is-lewd="isLewd"
      :is-detail="isDetail"
      :is-fullscreen="isFullscreen"
      :disable-operation="disableOperation"
      :player-cover="audioPlayerCover"
      :hover-on-cover-play="audioHoverOnCoverPlay"
      :parent-hovering="isMediaItemHovering"
      :image-component="imageComponent"
      :preview="preview"
      :autoplay="autoplay"
      :lazy-loading="lazyLoading"
      :inner-class="innerClass"
    />
    <div
      v-if="isLewd && isLewdBlurredLayer"
      class="nsfw-blur flex capitalize items-center justify-center flex-col"
    >
      <NeoIcon
        icon="eye-slash"
        class="mb-3"
      />
      <span class="font-bold">
        {{ $t('lewd.explicit') }}
      </span>
      <span class="nsfw-desc text-center">{{ $t('lewd.explicitDesc') }}</span>
    </div>
    <div
      v-if="hasNormalTag"
      class="bg-k-shade border-k-grey text-text-color flex items-center justify-center border rounded-md absolute right-3 top-3 image size-6 z-[18]"
    >
      <NeoIcon
        icon="image"
        pack="far"
        class="text-sm font-medium"
      />
    </div>
    <NeoButton
      v-if="isLewd"
      rounded
      no-shadow
      class="nsfw-action border-0 px-4 py-1 text-base"
      :class="{ hide: isLewdBlurredLayer }"
      :label="
        isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent')
      "
      @click="toggleContent"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ComputedOptions, ConcreteComponent, MethodOptions } from 'vue'
import { useElementHover, useElementVisibility } from '@vueuse/core'
import {
  NeoButton,
  NeoIFrameMedia,
  NeoIcon,
  NeoImageMedia,
  NeoJsonMedia,
  NeoObjectMedia,
  NeoUnknownMedia,
  NeoVideoMedia,
} from '@kodadot1/brick'
import AudioMedia from '@/components/shared/AudioMedia.vue'
import { getMimeType, resolveMedia, MediaType } from '@/utils/gallery/media'

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
    isFullscreen?: boolean
    // props for video component
    preview?: boolean
    autoplay?: boolean
    // props for image component
    lazyLoading?: boolean
    enableNormalTag?: boolean
    sizes?: string
    innerClass?: string
    imageComponent?:
      | string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
      | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>
  }>(),
  {
    src: '',
    animationSrc: '',
    mimeType: '',
    title: 'KodaDot NFT',
    original: false,
    isLewd: false,
    isDetail: false,
    placeholder: undefined,
    disableOperation: undefined,
    audioPlayerCover: '',
    isFullscreen: false,
    imageComponent: 'img',
    lazyLoading: false,
    enableNormalTag: false,
  },
)

const mediaRef = ref()
const mediaItem = ref<HTMLDivElement>()
// props.mimeType may be empty string "". Add `image/png` as fallback
const mimeType = computed(() => props.mimeType || type.value || 'image/png')

useMediaFullscreen({
  ref: mediaItem,
  isFullscreen: computed(() => props.isFullscreen),
})

const targetIsVisible = useElementVisibility(mediaItem)
const { placeholder: themedPlaceholder } = useTheme()

const modelComponent = ref<Component>()
const isModelComponentLoaded = ref(false)
const shouldLoadModelComponent = computed(() => {
  return targetIsVisible.value && mimeType.value === 'model/gltf-binary'
})
watch(shouldLoadModelComponent, (shouldLoad) => {
  if (shouldLoad && !isModelComponentLoaded.value) {
    modelComponent.value = defineAsyncComponent(
      async () => (await import('@kodadot1/brick')).NeoModelMedia,
    )
    isModelComponentLoaded.value = true
  }
})

const PREFIX = 'Neo'
const SUFFIX = 'Media'
const type = ref('')

const hasNormalTag = computed<boolean>(() => {
  return (
    props.enableNormalTag
    && Boolean(props.mimeType || type.value || !props.animationSrc) // avoid showing normal tag before type has updated
    && resolveMedia(mimeType.value) !== MediaType.IFRAME
    && !props.isDetail
    && !IMG_PLACEHOLDERS.includes(props.src)
  )
})
const isLewdBlurredLayer = ref(props.isLewd)
const components = {
  NeoImageMedia,
  NeoVideoMedia,
  NeoAudioMedia: AudioMedia,
  NeoJsonMedia,
  NeoIFrameMedia,
  NeoObjectMedia,
  NeoUnknownMedia,
}

const resolveComponent = computed(() => {
  let mediaType = resolveMedia(mimeType.value)

  if (mediaType === MediaType.IFRAME && !props.isDetail) {
    mediaType = MediaType.IMAGE
  }

  return mediaType === 'Model'
    ? modelComponent.value
    : components[PREFIX + mediaType + SUFFIX]
})
const placeholder = computed(() =>
  !props.placeholder ? themedPlaceholder.value : props.placeholder,
)
const properSrc = computed(() => props.src || placeholder.value)

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

function toggleFullscreen() {
  if (mediaRef.value.toggleFullscreen) {
    mediaRef.value.toggleFullscreen()
  }
}

defineExpose({ isLewdBlurredLayer, toggleFullscreen })
</script>

<style lang="scss" scoped>
.media-object {
  .nsfw-blur {
    backdrop-filter: blur(60px);
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgb(0 0 0 / 50%);
    color: #fff;

    .nsfw-desc {
      max-width: 18.75rem;
    }
  }
  .nsfw-action {
    @apply text-text-color bg-background-color;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.25rem;

    &.hide {
      @apply text-text-color bg-background-color;
    }
  }
}
</style>
