<template>
  <figure
    :class="{
      'relative pt-[100%]': !original,
    }">
    <TheImage
      :image-component="imageComponent"
      :image-component-props="{ sizes }"
      :src="src"
      :alt="alt"
      class="block rounded-none"
      :class="{ 'object-cover absolute inset-0 w-full h-full': !original }"
      data-testid="type-image"
      @error.once="onError" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'
import TheImage from '../../TheImage/TheImage.vue'
import type { ImageComponent } from '../../TheImage/TheImage.vue'

const props = withDefaults(
  defineProps<{
    imageComponent?: ImageComponent
    sizes?: string
    src: string
    alt?: string
    original: boolean
    placeholder: string
  }>(),
  {
    imageComponent: 'img',
    sizes: '450px md:350px lg:270px',
    alt: '',
  },
)

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    consola.log('[KODADOT::IMAGE] unable to load', props.src, e)
    target.removeAttribute('srcset')
    target.src = props.placeholder
  }
}
</script>
