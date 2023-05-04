<template>
  <figure class="image-wrapper image is-1by1" :class="customClass">
    <transition name="fade">
      <img
        :src="imageSrc || placeholder"
        :alt="alt"
        :class="['has-ratio', { 'is-rounded': rounded }]"
        @load="onImageLoad"
        @error="onImageError" />
    </transition>
    <transition name="fade">
      <slot v-if="!loaded" name="placeholder">
        <NeoSkeleton full-size no-margin :circle="rounded" />
      </slot>
    </transition>
  </figure>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'

const { $consola } = useNuxtApp()
const { placeholder } = useTheme()
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    customClass?: string
    rounded?: boolean
  }>(),
  {
    src: '',
    alt: 'KodaDot NFT minted multimedia',
    customClass: '',
  }
)

const imageSrc = ref(props.src)
const loaded = ref(false)

const onImageLoad = () => (loaded.value = true)
const onImageError = (ev: Event) => {
  $consola.error('[BasicImage] to load:', props.src, ev)
  imageSrc.value = placeholder.value
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  padding-top: 100%;
}
</style>
