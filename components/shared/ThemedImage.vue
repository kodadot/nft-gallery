<template>
  <div
    class="image"
    role="img"
    :aria-label="alt"
    :style="{
      '--src': `var(--${src})`,
      width: `${width}px`,
      height: `${height}px`,
    }" />
</template>
<script lang="ts" setup>
type Icons = 'mobile-logo' | 'desktop-logo' | 'profile' | 'stellate'

defineProps<{
  alt?: string
  src: Icons
  width?: number
  height?: number
}>()
</script>
<style lang="scss" scoped>
.image {
  background-image: var(--src);
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
