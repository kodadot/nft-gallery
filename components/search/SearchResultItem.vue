<template>
  <div class="search-result-item" :class="{ 'loading-item': isLoading }">
    <div class="media">
      <div class="media-left" :class="{ border: !isLoading }">
        <NeoSkeleton v-if="isLoading" width="64px" height="64px" />
        <BasicImage v-else custom-class="is-64x64" :src="image" />
      </div>
      <div
        v-if="isLoading"
        class="media-content is-flex is-flex-direction-column is-justify-content-center pt-2">
        <NeoSkeleton
          :count="1"
          :width="240"
          :height="22"
          size="medium"
          active />
        <NeoSkeleton
          :count="1"
          :width="150"
          :height="22"
          size="medium"
          active />
      </div>
      <div v-else class="media-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import BasicImage from '@/components/shared/view/BasicImage.vue'

withDefaults(
  defineProps<{
    isLoading?: boolean
    image?: string
  }>(),
  {
    isLoading: false,
    image: '',
  }
)
</script>

<style scoped>
.media-left :deep(img) {
  max-height: 100%;
}
</style>
