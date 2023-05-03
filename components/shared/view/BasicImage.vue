<template>
  <figure
    class="b-image-wrapper image is-1by1"
    :style="{ 'padding-top': '100%' }"
    :class="customClass">
    <transition name="fade">
      <img
        :src="src || placeholder"
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
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'KodaDot NFT minted multimedia' },
  customClass: { type: String, default: '' },
  rounded: Boolean,
})
const loaded = ref(false)

function onImageLoad() {
  loaded.value = true
}
function onImageError(ev: Event) {
  $consola.error('[BasicImage] to load:', props.src, ev)
}
</script>
