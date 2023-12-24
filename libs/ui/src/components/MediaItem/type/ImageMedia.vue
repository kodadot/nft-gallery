<template>
  <figure
    :class="{
      'relative pt-[100%]': !original && !isFullscreen,
      'pt-0': isFullscreen,
    }">
    <!-- load normal image -->
    <TheImage
      v-if="status === 'ok'"
      :image-component="imageComponent"
      :image-component-props="imageComponentProps"
      :src="src"
      :alt="alt"
      :class="className"
      data-testid="type-image"
      @error.once="() => onError('error-1')" />
    <!-- if fail, try to load original url -->
    <!-- e.g: NuxtImg component will replace image-worker url to cf-image. there is a case when cf-image return 404 -->
    <img
      v-if="status === 'error-1'"
      :src="src"
      :alt="alt"
      :class="className"
      data-testid="type-image"
      @error.once="() => onError('error-2')" />
    <!-- else, load placeholder -->
    <img
      v-if="status === 'error-2'"
      :src="placeholder"
      :alt="alt"
      :class="className"
      data-testid="type-image" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'
import { computed, defineProps, withDefaults } from 'vue'

import TheImage from '../../TheImage/TheImage.vue'
import type {
  ImageComponent,
  ImageComponentProps,
} from '../../TheImage/TheImage.vue'

const props = withDefaults(
  defineProps<{
    imageComponent?: ImageComponent
    imageComponentProps?: ImageComponentProps
    mimeType: string
    sizes?: string
    src: string
    alt?: string
    original: boolean
    placeholder: string
    isFullscreen?: boolean
  }>(),
  {
    imageComponent: 'img',
    imageComponentProps: undefined,
    sizes: '450px md:350px lg:270px',
    src: '',
    alt: '',
    isFullscreen: false,
  },
)

type Status = 'ok' | 'error-1' | 'error-2'
const status = ref<Status>('ok')
const isGif = computed(() => props.mimeType === 'image/gif')

const className = computed(() =>
  !props.original && !props.isFullscreen
    ? 'object-cover absolute inset-0 w-full h-full'
    : 'block rounded-none',
)

const isBlob = computed(() => props.src.startsWith('blob:'))

const toOriginalContentUrl = (baseurl: string) => {
  if (isBlob.value) {
    return baseurl
  }
  const url = new URL(baseurl)
  url.searchParams.append('original', 'true')
  return url.toString()
}

const onError = async (phase: Status) => {
  consola.log('[KODADOT::IMAGE] unable to load:', `${phase}:`, props.src)
  status.value = phase
}

const sizes = computed(() =>
  (props.imageComponentProps?.width && props.imageComponentProps?.height) ||
  props.sizes === 'original' ||
  isGif.value
    ? undefined
    : props.sizes,
)

const src = computed(() =>
  isGif.value ? toOriginalContentUrl(props.src) : props.src,
)

const imageComponentProps = computed(() => ({
  ...(props.imageComponentProps || {}),
  sizes: sizes.value,
}))
</script>
