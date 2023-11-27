<template>
  <ImageMedia
    v-if="avatar"
    :placeholder="placeholder"
    :image-component="imageComponent"
    :src="avatar"
    :alt="name"
    class="border neo-avatar"
    :width="size"
    :height="size"
    :style="customStyle"
    :original="true" />
  <img
    v-else
    :src="placeholder"
    :alt="name"
    :width="size"
    :height="size"
    :style="customStyle"
    class="border neo-avatar" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { ImageComponent } from '../TheImage/TheImage.vue'
import ImageMedia from '../MediaItem/type/ImageMedia.vue'

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
</script>

<style lang="scss">
@import './NeoAvatar.scss';
</style>
