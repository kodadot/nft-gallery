<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <!-- load normal image -->
    <TheImage
      v-if="status === 'ok'"
      :image-component="imageComponent"
      :image-component-props="{ sizes }"
      :src="src"
      :alt="alt"
      class="is-block image-media__image no-border-radius"
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
import { defineProps, withDefaults } from 'vue'

import TheImage from '../../TheImage/TheImage.vue'
import type { ImageComponent } from '../../TheImage/TheImage.vue'

const props = withDefaults(
  defineProps<{
    imageComponent?: ImageComponent
    sizes?: string
    src?: string
    alt?: string
    original: boolean
    placeholder: string
    isDetail?: boolean
    isDarkMode?: boolean
  }>(),
  {
    sizes: '450px md:350px lg:270px',
    imageComponent: 'img',
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
</script>

<style>
.image-container.is-square > img {
  object-fit: cover;
}
</style>
