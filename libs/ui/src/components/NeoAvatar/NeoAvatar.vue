<template>
  <ImageMedia
    v-if="avatar"
    :placeholder="placeholder"
    :image-component="imageComponent"
    :image-component-props="{
      width: size,
      height: size,
      fit: 'cover',
    }"
    :src="avatar"
    :alt="name"
    class="border-default border-border-color max-w-none object-cover"
    :width="size"
    :height="size"
    :class="`size-[${size}px]`"
    :original="true" />
  <img
    v-else
    :src="placeholder"
    :alt="name"
    :width="size"
    :height="size"
    :class="`size-[${size}px]`" />
</template>

<script setup lang="ts">
import type { ImageComponent } from '../TheImage/TheImage.vue'
import ImageMedia from '../MediaItem/type/ImageMedia.vue'

defineProps<{
  imageComponent?: ImageComponent
  avatar?: string
  placeholder: string
  name: string
  size: number
}>()
</script>
