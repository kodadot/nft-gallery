<template>
  <b-image
    :src="src || placeholder"
    :src-fallback="placeholder"
    :alt="alt"
    ratio="1by1"
    :class="customClass"
    :rounded="rounded"
    data-cy="type-image"
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
const { $consola } = useNuxtApp()
const { isDarkMode } = useTheme()
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'KodaDot NFT minted multimedia' },
  customClass: { type: String, default: '' },
  rounded: Boolean,
})

const placeholder = computed(() => {
  return isDarkMode.value ? '/placeholder.webp' : '/placeholder-white.webp'
})

function onImageError(ev: Event, src: string) {
  $consola.error('[BasicImage] to load:', src, ev)
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
