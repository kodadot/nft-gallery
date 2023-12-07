<template>
  <div ref="mediaItem" class="media-object" style="height: fit-content">
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
      class="nsfw-blur is-capitalized is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
      <NeoIcon icon="eye-slash" class="mb-3" />
      <span class="has-text-weight-bold">
        {{ $t('lewd.explicit') }}
      </span>
      <span class="nsfw-desc text-align-center">{{
        $t('lewd.explicitDesc')
      }}</span>
    </div>
    <div
      v-if="isInteractive"
      class="k-shade border-k-grey is-flex is-align-items-center is-justify-content-center border is-rounded absolute-position image is-24x24">
      <NeoIcon
        icon="code"
        pack="far"
        class="is-size-7 has-text-weight-medium" />
    </div>
    <NeoButton
      v-if="isLewd"
      rounded
      no-shadow
      class="nsfw-action no-border px-4 py-1 is-size-6"
      :class="{ hide: isLewdBlurredLayer }"
      :label="
        isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent')
      "
      @click="toggleContent" />
  </div>
</template>

<script lang="ts" setup>
import type { ComputedOptions, ConcreteComponent, MethodOptions } from 'vue'
import { useElementHover, useElementVisibility } from '@vueuse/core'
import {
  NeoAudioMedia,
  NeoButton,
  NeoIFrameMedia,
  NeoIcon,
  NeoImageMedia,
  NeoJsonMedia,
  NeoObjectMedia,
  NeoUnknownMedia,
  NeoVideoMedia,
} from '@kodadot1/brick'
import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import { MediaType } from '@/components/rmrk/types'

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
      async () => (await import('@kodadot1/brick')).NeoModelMedia,
    )
    isModelComponentLoaded.value = true
  }
})

const PREFIX = 'Neo'
const SUFFIX = 'Media'

const isInteractive = computed(() => {
  return resolveMedia(mimeType.value) === MediaType.IFRAME && !props.isDetail
})
const type = ref('')

const isLewdBlurredLayer = ref(props.isLewd)
const components = {
  NeoImageMedia,
  NeoVideoMedia,
  NeoAudioMedia,
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

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
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
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.25rem;
    @include ktheme() {
      color: theme('text-color') !important;
      background: theme('background-color') !important;
    }
    &.hide {
      @include ktheme() {
        color: theme('background-color') !important;
        background: theme('text-color') !important;
      }
    }
  }

  .absolute-position {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
  }
}
</style>
