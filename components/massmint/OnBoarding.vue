<template>
  <div>
    <div class="flex items-center mb-7 px-8">
      <nuxt-link
        :to="'https://hello.kodadot.xyz/tutorial/minting/how-to-mass-mint-nfts'"
        class="is-size-2-desktop is-size-2-tablet is-size-3-mobile flex flex-grow justify-center font-bold"
        target="_blank"
        rel="nofollow noopener noreferrer">
        {{ $t('massmint.onboarding.pageTitle') }}
      </nuxt-link>
      <NeoButton
        :label="$t('massmint.onboarding.skip')"
        icon="arrow-right"
        @click="toMassMint" />
    </div>
    <div class="is-relative mb-6">
      <div
        ref="carouselRef"
        class="carousel flex flex-nowrap"
        :class="`slide-${currentSlide}`">
        <OnBoardingCard
          v-for="(card, index) in cards"
          :key="index"
          :title="card.title"
          :count="`${index + 1}/${cards.length}`"
          :content="card.content"
          :active="index === currentSlide">
          <div v-if="index === 1">
            <p class="is-size-6 font-bold mb-3">
              {{ $t('massmint.onboarding.cards.1.subtitle') }}:
            </p>
            <p class="is-size-6 mb-5">
              {{ $t('massmint.onboarding.cards.1.instructions') }}
            </p>
            <div class="flex justify-between items-center mb-4 column-mobile">
              <span class="is-size-6 font-bold">
                {{ $t('massmint.onboarding.cards.1.codeStructure') }}:
              </span>
              <div class="flex tab-gap">
                <NeoButton
                  v-for="tab in descriptionTabs"
                  :key="tab"
                  rounded
                  no-shadow
                  :label="tab.label"
                  :active="activeDescriptionTab === tab.label"
                  class="filter-tag"
                  @click="activeDescriptionTab = tab.label" />
              </div>
            </div>
            <Markdown
              :source="
                descriptionTabs[activeDescriptionTab].fileStructureDescription
              "
              class="fixed-height white-space-break-spaces-mobile code" />
            <div class="flex justify-end mt-2">
              <NeoButton
                v-safe-href="
                  `/massmint/template.${activeDescriptionTab.toLowerCase()}`
                "
                variant="text"
                class="has-text-link"
                no-shadow
                tag="a"
                download>
                {{ $t('massmint.onboarding.downloadTemplate') }}
                <NeoIcon icon="arrow-up-right" />
              </NeoButton>
            </div>
          </div>
        </OnBoardingCard>
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

    <div class="flex justify-center">
      <NeoButton
        :label="btn.label"
        class="flex-grow limit-width h-auto py-3"
        :variant="btn.variant"
        @click="btn.onClick" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoButtonVariant, NeoIcon } from '@kodadot1/brick'
import OnBoardingCard from './OnBoardingCard.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { descriptionTabs } from './descriptionTabs'
import { SwipeDirection, useSwipe } from '@vueuse/core'
import Markdown from '@/components/shared/Markdown.vue'

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
      },
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
@import '@/assets/styles/components/carousel-arrows';

$card-width-percents: 54%;
$gap-percents: 5.5%;

$max-card-width: 760px;
$min-card-width: 225px;
$max-gap: 80px;

$gap: min($gap-percents, $max-gap);
$card-width: clamp($min-card-width, $card-width-percents, $max-card-width);

.carousel {
  transition: transform 0.5s ease-in-out;
  --card-gap: #{$gap};
  --card-width: #{$card-width};
  --card-height: 464px;
  --base-shift: calc((100% - var(--card-width)) / 2);
  gap: var(--card-gap);
  @include mobile {
    --card-width: 90vw;
    --card-gap: 2.5%;
  }

  &.slide-0 {
    transform: translateX(var(--base-shift));
  }

  &.slide-1 {
    transform: translateX(
      calc(var(--base-shift) + (-1 * (var(--card-width) + var(--card-gap))))
    );
  }

  &.slide-2 {
    transform: translateX(
      calc(var(--base-shift) + (-2 * (var(--card-width) + var(--card-gap))))
    );
  }
}

:deep(.white-space-break-spaces-mobile) {
  pre {
    @include touch {
      width: 100%;
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

.code :deep(pre) {
  font-size: 1rem !important;
}

.carousel-dot {
  @apply w-2.5 h-2.5 transition-[background-color] duration-[0.2s] ease-[ease-in-out] rounded-[25%];

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
  max-width: 290px;
  min-width: $min-card-width;
}

.h-auto {
  height: auto;
}

.arrow {
  &-left {
    left: calc((100% - $card-width) / 2 - 32px);
  }
  &-right {
    right: calc((100% - $card-width) / 2 - 32px);
  }
}

.tab-gap {
  gap: 0.75rem;
}
</style>
