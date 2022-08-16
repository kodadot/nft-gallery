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

<script lang="ts" setup>
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'KodaDot NFT minted multimedia' },
  customClass: { type: String, default: '' },
  rounded: Boolean,
})

const { $consola } = useNuxtApp()

function onImageError(ev: Event, src: string) {
  $consola.log('[BasicImage] to load:', src, ev)
}
</script>

<style scoped>
.b-skeleton {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
