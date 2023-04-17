<template>
  <div>
    <div class="is-flex is-align-items-center mb-8 px-8">
      <div
        class="is-size-1-desktop is-size-2-tablet is-size-3-mobile is-flex is-flex-grow-1 is-justify-content-center has-text-weight-bold">
        {{ $t('massmint.onboarding.pageTitle') }}
      </div>
      <NeoButton
        :label="$t('massmint.onboarding.skip')"
        icon="arrow-right"
        icon-pack="fas"
        @click.native="toMassMint" />
    </div>
    <div class="is-relative">
      <div
        ref="carouselRef"
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
              <Markdown :source="card.content" />
            </div>
          </div>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="currentSlide > 0"
          class="arrow arrow-left"
          @click="prevSlide" />
      </Transition>
      <Transition name="fade">
        <div
          v-if="currentSlide < numOfCards - 1"
          class="arrow arrow-right"
          @click="nextSlide" />
      </Transition>
    </div>

    <div class="is-flex is-justify-content-center my-8">
      <span
        v-for="(card, index) in cards"
        :key="index"
        class="carousel-dot mx-2"
        :class="{ 'is-active': index === currentSlide }"></span>
    </div>
    <div class="is-flex is-justify-content-center">
      <NeoButton
        :label="btn.label"
        class="is-flex-grow-1 limit-width"
        :variant="btn.variant"
        @click.native="btn.onClick" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { SwipeDirection, useSwipe } from '@vueuse/core'

const router = useRouter()
const { urlPrefix } = usePrefix()
const { $i18n, $consola } = useNuxtApp()

const numOfCards = 3
const preferencesStore = usePreferencesStore()
const currentSlide = ref(0)
const swipeThreshold = 40
const carouselRef = ref<HTMLElement | null>(null)

useSwipe(carouselRef, {
  threshold: swipeThreshold,
  onSwipeEnd: (_, direction) => {
    if (direction === SwipeDirection.LEFT) {
      nextSlide()
    } else if (direction === SwipeDirection.RIGHT) {
      prevSlide()
    }
  },
})

const cards = computed(() => {
  const indices = Array.from({ length: numOfCards }, (_, i) => i + 1)
  return indices.map((i: number) => ({
    title: $i18n.t(`massmint.onboarding.cards.${i}.title`),
    content: $i18n.t(`massmint.onboarding.cards.${i}.content`),
  }))
})

const nextSlide = () => {
  if (currentSlide.value < numOfCards - 1) {
    currentSlide.value++
  }
}
const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const toMassMint = () => {
  preferencesStore.setVisitedOnboarding(true)
  router
    .replace({
      path: `/${urlPrefix.value}/massmint`,
    })
    .catch($consola.warn)
}

const btn = computed(() =>
  currentSlide.value === 2
    ? {
        label: $i18n.t('massmint.onboarding.done'),
        variant: 'k-accent' as NeoButtonVariant,
        onClick: toMassMint,
      }
    : {
        label: $i18n.t('massmint.onboarding.next'),
        variant: 'primary' as NeoButtonVariant,
        onClick: nextSlide,
      }
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
@import '@/styles/components/carousel-arrows';

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

.arrow {
  &-left {
    left: 30px;
  }
  &-right {
    right: 30px;
  }
}
</style>
