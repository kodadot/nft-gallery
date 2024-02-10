<template>
  <div class="top-collection-card-skeleton border border-border-color">
    <div class="top-collection-card-skeleton-banner relative">
      <NeoSkeleton no-margin :rounded="false" full-size />

      <div class="top-collection-card-banner-avatar-container">
        <div class="top-collection-card-banner-avatar-inner relative">
          <NeoSkeleton
            no-margin
            :rounded="false"
            full-size
            class="border border-card-border-color" />
        </div>
      </div>
    </div>

    <div class="top-collection-card-skeleton-info">
      <div class="flex justify-center">
        <div class="relative w-40 h-6">
          <NeoSkeleton no-margin :rounded="false" full-size />
        </div>
      </div>

      <div class="info-fields">
        <div>
          <div class="relative w-10 h-3 mb-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
          <div class="relative w-20 h-5 mt-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
        </div>

        <div class="flex flex-col items-end">
          <div class="relative w-10 h-3 mb-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
          <div class="relative w-20 h-5 mt-1">
            <NeoSkeleton no-margin :rounded="false" full-size />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>

<style lang="scss" scoped>
@import './TopCollectionsCard.scss';
</style>
