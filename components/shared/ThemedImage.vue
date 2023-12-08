<template>
  <div
    class="image"
    :class="{
      'square-image': isSquare,
    }"
    role="img"
    :aria-label="alt"
    :style="{
      '--src': `var(--${src})`,
      width: `${width}px`,
      height: `${height}px`,
    }" />
</template>
<script lang="ts" setup>
type Icons =
  | 'mobile-logo'
  | 'desktop-logo'
  | 'profile'
  | 'stellate'
  | 'empty-cart'
  | 'waifu'
  | 'landing-shape-header-left'
  | 'landing-shape-header-right'
  | 'congrats'
  | 'signup-voucher'
  | 'unlockable'
  | 'transak'
  | 'ramp'

defineProps<{
  alt?: string
  src: Icons
  width?: number
  height?: number
  isSquare?: boolean
}>()
</script>
<style lang="scss" scoped>
.image {
  background-image: var(--src);
  background-size: contain;
  background-repeat: no-repeat;
}

.square-image {
  width: 100%;
  aspect-ratio: 1;
}
</style>
