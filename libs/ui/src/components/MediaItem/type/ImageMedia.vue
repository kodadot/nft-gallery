<template>
  <figure
    :class="{
      'relative pt-[100%]': !original,
    }">
    <!-- load normal image -->
    <TheImage
      v-if="status === 'ok'"
      :image-component="imageComponent"
      :image-component-props="imageComponentProps"
      :src="src"
      :alt="alt"
      class="block rounded-none"
      :class="{ 'object-cover absolute inset-0 w-full h-full': !original }"
      data-testid="type-image"
      @error.once="() => onError('error-1')" />
    <!-- if fail, try to load original url -->
    <!-- e.g: NuxtImg component will replace image-worker url to cf-image. there is a case when cf-image return 404 -->
    <img
      v-if="status === 'error-1'"
      :src="src"
      :alt="alt"
      class="is-block image-media__image no-border-radius"
      data-testid="type-image"
      @error.once="() => onError('error-2')" />
    <!-- else, load placeholder -->
    <img
      v-if="status === 'error-2'"
      :src="placeholder"
      :alt="alt"
      class="is-block image-media__image no-border-radius"
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
    sizes?: string
    src: string
    alt?: string
    original: boolean
    placeholder: string
  }>(),
  {
    imageComponent: 'img',
    imageComponentProps: undefined,
    sizes: '450px md:350px lg:270px',
    src: '',
    alt: '',
  },
)

type Status = 'ok' | 'error-1' | 'error-2'
const status = ref<Status>('ok')

const onError = async (phase: Status) => {
  consola.log('[KODADOT::IMAGE] unable to load:', `${phase}:`, props.src)
  status.value = phase
}

// Ignore sizes if width and height are provided
const sizes = computed(() =>
  (props.imageComponentProps?.width && props.imageComponentProps?.height) ||
  props.sizes === 'original'
    ? undefined
    : props.sizes,
)

const imageComponentProps = computed(() => ({
  ...(props.imageComponentProps || {}),
  sizes: sizes.value,
}))
</script>
