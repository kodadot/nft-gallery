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
@import '@/assets/styles/abstracts/variables';

$card-width-percents: 54%;
$max-card-width: 760px;
$min-card-width: 225px;
$card-height: 464px;

$card-width: clamp($min-card-width, $card-width-percents, $max-card-width);

.carousel-card {
  flex: 0 0 #{$card-width};
  min-height: $card-height;

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
  &__content {
    @include ktheme() {
      color: theme('text-color') !important;
    }
    .content {
      @include ktheme() {
        color: theme('text-color') !important;
      }
    }
  }
  &.not-active {
    opacity: 0.5;
  }
}
</style>
