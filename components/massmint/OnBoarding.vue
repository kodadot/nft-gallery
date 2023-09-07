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
        <OnBoardingCard
          :title="cards[0].title"
          :content="cards[0].content"
          :active="0 === currentSlide" />
        <OnBoardingCard :title="cards[1].title" :active="1 === currentSlide">
          <div>
            <p class="is-size-6 has-text-weight-bold mb-3">
              {{ $t('massmint.onboarding.cards.1.subtitle') }}:
            </p>
            <p class="is-size-6 mb-5">
              {{ $t('massmint.onboarding.cards.1.instructions') }}
            </p>
            <div
              class="is-flex is-justify-content-space-between is-align-items-center mb-4 column-mobile">
              <span class="is-size-6 has-text-weight-bold"
                >{{ $t('massmint.onboarding.cards.1.codeStructure') }}:</span
              >
              <div class="is-flex tab-gap">
                <NeoButton
                  v-for="tab in descriptionTabs"
                  :key="tab"
                  rounded
                  no-shadow
                  :label="tab.label"
                  :active="activeDescriptionTab === tab.label"
                  class="filter-tag"
                  @click.native="activeDescriptionTab = tab.label" />
              </div>
            </div>
            <Markdown
              :source="
                descriptionTabs[activeDescriptionTab].fileStructureDescription
              "
              class="fixed-height white-space-break-spaces-mobile" />
          </div>
        </OnBoardingCard>

        <OnBoardingCard
          :title="cards[2].title"
          :content="cards[2].content"
          :active="2 === currentSlide" />
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
        v-for="(_, index) in cards"
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
import OnBoardingCard from './OnBoardingCard.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { descriptionTabs } from './descriptionTabs'
import { SwipeDirection, useSwipe } from '@vueuse/core'

const router = useRouter()
const { urlPrefix } = usePrefix()
const { $i18n, $consola } = useNuxtApp()

const numOfCards = 3
const preferencesStore = usePreferencesStore()
const currentSlide = ref(0)
const swipeThreshold = 40
const carouselRef = ref<HTMLElement | null>(null)

const activeDescriptionTab = ref('JSON')

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
  return Array.from({ length: numOfCards }, (_, i) => ({
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

:deep .white-space-break-spaces-mobile {
  pre {
    @include touch {
      width: 50vw;
      white-space: break-spaces;
    }
  }
}

.column-mobile {
  @include mobile {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.75rem;
  }
}
.filter-tag {
  &:hover {
    background-color: unset;
  }
  &.active {
    @include ktheme() {
      background-color: theme('k-shade');
      color: theme('black');
    }
    &:hover {
      @include ktheme() {
        background-color: theme('k-shade') !important;
      }
    }
  }
}

.fixed-height {
  height: 180px;
  overflow-y: auto;
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

.tab-gap {
  gap: 0.75rem;
}
</style>
