<template>
  <div
    class="carousel-card p-5 mobile-padding"
    :class="{ 'not-active': !active }">
    <div class="card__content">
      <p
        class="title is-size-3-desktop is-size-3-tablet is-size-5-mobile is-capitalized">
        {{ title }}
      </p>
      <slot>
        <div class="content is-size-4-tablet is-size-5-mobile">
          <Markdown :source="content" />
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
  content?: string
  active?: boolean
}>()
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.carousel-card {
  flex: 0 0 var(--card-width);
  min-height: var(--card-height);

  &.mobile-padding {
    @include mobile {
      padding: 0.75rem !important;
    }
  }
  @include ktheme() {
    box-shadow: theme('primary-shadow');
    background: theme('background-color');
    border: 1px solid theme('border-color');
  }
  .card__content {
    @include ktheme() {
      color: theme('text-color') !important;
    }
    .content {
      @include ktheme() {
        color: theme('text-color') !important;
      }
      :deep a {
        @include ktheme() {
          color: theme('k-blue') !important;
        }
      }
    }
  }
  &.not-active {
    opacity: 0.5;
  }
}
</style>
