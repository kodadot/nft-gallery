<script lang="ts" setup>
import { useNuxtApp } from '#app'

interface Props {
  src?: string
  alt?: string
  customClass?: string
  rounded?: boolean
}
const {
  src,
  alt = 'KodaDot NFT minted multimedia',
  customClass,
  rounded,
} = defineProps<Props>()

const { $consola } = useNuxtApp()

function onImageError(ev: Event, src: string) {
  $consola.log('[BasicImage] to load:', src, ev)
}
</script>

<template>
  <b-image
    :src="src || '/placeholder.webp'"
    src-fallback="/placeholder.webp"
    :alt="alt"
    ratio="1by1"
    :class="customClass"
    :rounded="rounded"
    @error="onImageError">
    <template #placeholder>
      <b-skeleton
        class="skeleton-placeholder"
        height="100%"
        :circle="rounded" />
    </template>
  </b-image>
</template>

<style scoped>
.b-skeleton {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
