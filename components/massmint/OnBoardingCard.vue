<template>
  <div
    class="carousel-card p-7 mobile-padding"
    :class="{ 'not-active': !active }"
  >
    <div class="card__content">
      <div class="flex justify-between">
        <p class="title text-xl sm:text-3xl capitalize">
          {{ title }}
        </p>
        <span class="text-2xl">{{ count }}</span>
      </div>
      <slot>
        <div class="content text-xl/[1.5] sm:text-base/[1.5]">
          <Markdown :source="content" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  count?: string
  content?: string
  active?: boolean
}>()
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.carousel-card {
  flex: 0 0 var(--card-width);
  min-height: var(--card-height);

  &.mobile-padding {
    @include mobile {
      padding: 0.75rem !important;
    }
  }
  box-shadow: var(--primary-shadow);
  background: var(--background-color);
  border: 1px solid var(--border-color);

  .card__content {
    color: var(--text-color) !important;
    .content {
      color: var(--text-color) !important;
      @include tablet {
        font-size: 1.25rem !important;
      }

      :deep(a) {
        color: var(--k-blue) !important;
      }
    }
  }
  &.not-active {
    opacity: 0.5;
  }
}
</style>
