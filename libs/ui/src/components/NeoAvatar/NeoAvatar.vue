<template>
  <ImageMedia
    v-if="avatar"
    :placeholder="placeholder"
    :image-component="imageComponent"
    :src="avatar"
    :alt="name"
    :class="className"
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
    :class="className" />
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

const className = 'border-default border-border-color max-w-none object-cover'
</script>
