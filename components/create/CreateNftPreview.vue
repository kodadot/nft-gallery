<template>
  <div class="preview">
    <p class="has-text-weight-bold">{{ $t('mint.nft.preview.title') }}</p>

    <div class="preview-card border k-shadow theme-background-color">
      <div class="preview-image" :style="{ backgroundImage: `url(${image})` }">
        <p v-if="!image" class="p-4">{{ $t('mint.nft.preview.uploadArt') }}</p>
      </div>
      <div class="preview-content">
        <p class="has-text-weight-bold is-ellipsis">{{ name || 'Untitled' }}</p>
        <p class="is-size-7 is-ellipsis">
          {{ collection || $t('mint.nft.preview.noCollection') }}
        </p>

        <div
          class="is-flex is-justify-content-space-between is-align-items-center mt-4">
          <p class="has-text-weight-bold">{{ price || '$$$' }} {{ symbol }}</p>
          <p class="is-size-7">{{ NAMES[chain || 'ahk'] || '--' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAMES } from '@kodadot1/static'

defineProps<{
  name?: string
  collection?: string
  price?: string | number
  symbol?: string
  chain?: string
  image?: string
}>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.preview {
  position: fixed;
  top: 10rem;
  right: 2rem;

  &-card {
    width: 15rem;
  }

  &-image {
    background-color: #d7d7d7;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    height: 17.5rem;
    text-align: center;
    font-size: 0.75rem;
  }

  &-content {
    padding: 0.5rem 1rem;
  }

  @include touch() {
    display: none;
  }
}
</style>
