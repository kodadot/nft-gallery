<template>
  <div>
    <div class="flex items-center mb-7 px-8">
      <nuxt-link
        :to="'https://hello.kodadot.xyz/tutorial/minting'"
        class="md:text-[2.5rem]/normal text-3xl/normal flex grow justify-center font-bold"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {{ $t('massmint.onboarding.pageTitle') }}
      </nuxt-link>
      <NeoButton
        :label="$t('massmint.onboarding.skip')"
        icon="arrow-right"
        @click="toMassMint"
      />
    </div>
    <div class="relative mb-6">
      <div
        ref="carouselRef"
        class="carousel flex flex-nowrap"
        :class="`slide-${currentSlide}`"
      >
        <OnBoardingCard
          v-for="(card, index) in cards"
          :key="index"
          :title="card.title"
          :count="`${index + 1}/${cards.length}`"
          :content="card.content"
          :active="index === currentSlide"
        >
          <div v-if="index === 1">
            <p class="text-base font-bold mb-3">
              {{ $t('massmint.onboarding.cards.1.subtitle') }}:
            </p>
            <p class="text-base mb-5">
              {{ $t('massmint.onboarding.cards.1.instructions') }}
            </p>
            <div class="flex justify-between items-center mb-4 column-mobile">
              <span class="text-base font-bold">
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
                  @click="activeDescriptionTab = tab.label"
                />
              </div>
            </div>
            <Markdown
              :source="
                descriptionTabs[activeDescriptionTab].fileStructureDescription
              "
              class="h-[180px] max-w-[678px] overflow-auto white-space-break-spaces-mobile"
            />
            <div class="flex justify-end mt-2">
              <NeoButton
                v-safe-href="
                  `/massmint/template.${activeDescriptionTab.toLowerCase()}`
                "
                variant="text"
                class="text-k-blue hover:text-k-blue-hover"
                no-shadow
                tag="a"
                download
              >
                {{ $t('massmint.onboarding.downloadTemplate') }}
                <KIcon name="i-mdi:arrow-up-right" />
              </NeoButton>
            </div>
          </div>
        </OnBoardingCard>
      </div>
      <Transition name="fade">
        <button
          v-if="currentSlide > 0"
          class="arrow arrow-left arrow-icon rounded-full"
          @click="prevSlide"
        >
          <KIcon
            name="i-mdi:chevron-left"
            size="medium"
          />
        </button>
      </Transition>
      <Transition name="fade">
        <button
          v-if="currentSlide < numOfCards - 1"
          class="arrow arrow-right arrow-icon rounded-full"
          @click="nextSlide"
        >
          <KIcon
            name="i-mdi:chevron-right"
            size="medium"
          />
        </button>
      </Transition>
    </div>

    <div class="flex justify-center">
      <NeoButton
        :label="btn.label"
        class="grow limit-width h-auto py-3"
        :variant="btn.variant"
        @click="btn.onClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { NeoButtonVariant } from '@kodadot1/brick'
import { NeoButton } from '@kodadot1/brick'
import { SwipeDirection, useSwipe } from '@vueuse/core'
import OnBoardingCard from './OnBoardingCard.vue'
import { descriptionTabs } from './descriptionTabs'
import { usePreferencesStore } from '@/stores/preferences'
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
    }
    else if (direction === SwipeDirection.RIGHT) {
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
        variant: 'primary' as NeoButtonVariant,
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
@import '@/assets/styles/abstracts/mixins';
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

  @include bulma-mobile {
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
    @include bulma-touch {
      width: 100%;
      white-space: break-spaces;
    }
  }
}

.column-mobile {
  @include bulma-mobile {
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
    background-color: rgba(var(--k-shade)) !important;
    color: rgba(var(--black)) !important;

    &:hover {
      background-color: rgba(var(--k-shade)) !important;
    }
  }
}

.carousel-dot {
  width: 0.625rem;
  height: 0.625rem;
  transition: background-color 0.2s ease-in-out;
  border-radius: 25%;
  background-color: var(--k-shade);

  &.is-active {
    background-color: var(--text-color);
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
