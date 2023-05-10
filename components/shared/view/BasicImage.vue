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
      <NeoSkeleton full-size no-margin :circle="rounded" />
    </template>
  </b-image>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'

const { $consola } = useNuxtApp()
const { placeholder } = useTheme()
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'KodaDot NFT minted multimedia' },
  customClass: { type: String, default: '' },
  rounded: Boolean,
})

function onImageError(ev: Event, src: string) {
  $consola.error('[BasicImage] to load:', src, ev)
}
</script>
