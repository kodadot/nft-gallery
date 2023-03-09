<template>
  <div>
    <div class="is-flex is-align-items-center mb-6 px-6">
      <div
        class="is-size-1-desktop is-size-2-tablet is-size-3-mobile is-flex is-flex-grow-1 is-justify-content-center has-text-weight-bold">
        Mass Mint Onboarding
      </div>
      <NeoButton :label="'Skip'" icon="arrow-right" icon-pack="fas" />
    </div>
    <div
      class="carousel is-flex is-flex-wrap-nowrap"
      :class="`slide-${currentSlide}`">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="carousel-card p-5 mobile-padding"
        :class="{ 'not-active': index !== currentSlide }">
        <div class="card__content">
          <p
            class="title is-size-2-desktop is-size-3-tablet is-size-5-mobile is-capitalized">
            {{ card.title }}
          </p>
          <div class="content is-size-4-tablet is-size-5-mobile">
            <VueMarkdown :source="card.content" />
          </div>
        </div>
      </div>
    </div>
    <div class="is-flex is-justify-content-center my-6">
      <span
        v-for="(card, index) in cards"
        :key="index"
        class="carousel-dot mx-2"
        :class="{ 'is-active': index === currentSlide }"></span>
    </div>
    <div class="is-flex is-justify-content-center">
      <NeoButton
        :label="currentSlide === 2 ? 'Done' : 'Next'"
        class="is-flex-grow-1 limit-width"
        :variant="currentSlide === 2 ? 'k-accent' : 'primary'"
        @click.native="nextSlide" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NeoButton } from '@kodadot1/brick'
import VueMarkdown from 'vue-markdown-render'
const { $i18n } = useNuxtApp()
const numOfCards = 3
const cards = computed(() => {
  const indices = Array.from({ length: numOfCards }, (_, i) => i + 1)
  return indices.map((i: number) => ({
    title: $i18n.t(`massmint.onboarding.cards.${i}.title`),
    content: $i18n.t(`massmint.onboarding.cards.${i}.content`),
  }))
})

const currentSlide = ref(0)

const nextSlide = () => {
  if (currentSlide.value < numOfCards - 1) {
    currentSlide.value++
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

$card-width-percents: 54%;
$gap-percents: 5.5%;

$max-card-width: 760px;
$min-card-width: 225px;
$card-height: 464px;
$max-gap: 80px;

$gap: min($gap-percents, $max-gap);
$card-width: clamp($min-card-width, $card-width-percents, $max-card-width);

$base-shift: calc((100% - $card-width) / 2);

.carousel {
  transition: transform 0.5s ease-in-out;
  gap: #{$gap};

  &.slide-0 {
    transform: translateX($base-shift);
  }

  &.slide-1 {
    transform: translateX(calc($base-shift + (-1 * ($card-width + $gap))));
  }

  &.slide-2 {
    transform: translateX(calc($base-shift + (-2 * ($card-width + $gap))));
  }
}

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

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 25%;
  transition: background-color 0.2s ease-in-out;
  @include ktheme() {
    background-color: theme('k-shade');
  }

  &.is-active {
    @include ktheme() {
      background-color: theme('text-color');
    }
  }
}

.limit-width {
  max-width: $card-width;
  min-width: $min-card-width;
}
</style>
