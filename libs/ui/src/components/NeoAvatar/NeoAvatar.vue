<template>
  <TheImage
    v-if="avatar"
    :image-component="imageComponent"
    :src="avatar"
    :alt="name"
    class="border neo-avatar"
    :width="size"
    :height="size"
    :style="customStyle"
    @error.once="onError" />
  <img
    v-else
    :src="placeholder"
    :width="size"
    :height="size"
    :style="customStyle"
    class="border neo-avatar" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { ImageComponent } from '../TheImage/TheImage.vue'
import TheImage from '../TheImage/TheImage.vue'

const props = defineProps<{
  imageComponent?: ImageComponent
  avatar?: string
  placeholder: string
  name: string
  size: number
}>()

const customStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    target.removeAttribute('srcset')
    target.src = props.placeholder
  }
}
</script>

<style lang="scss">
@import './NeoAvatar.scss';
</style>
