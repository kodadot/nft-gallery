<template>
  <div class="carousel-agnostic">
    <div class="navigation-wrapper">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in nfts"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide carousel-item">
          <div class="h-full is-flex is-flex-direction-column">
            <CarouselMedia :item="item" />
            <CarouselInfo :item="item" />
          </div>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="sliderSettings.leftArrowValid"
          class="arrow arrow-left"
          @click="slider?.moveToIdx(sliderSettings.leftCarouselIndex)"></div>
      </Transition>
      <Transition name="fade">
        <div
          v-if="sliderSettings.rightArrowValid"
          class="arrow arrow-right"
          @click="slider?.moveToIdx(sliderSettings.rightCarouselIndex)"></div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue.es'
import { wheelControls } from '../utils/useCarousel'

const props = defineProps<{
  nfts: CarouselNFT[]
  step: number
}>()

const url = inject('itemUrl', 'gallery') as string
const isCollection = computed(() => url.includes('collection'))
provide('isCollection', isCollection.value)

const current = ref(0)

const [wrapper, slider] = useKeenSlider(
  {
    initial: current.value,
    rubberband: false,
    slideChanged: (s) => {
      current.value = s.track.details.rel
    },
    detailsChanged: (s) => {
      s.slides.forEach((slide, index) => {
        if (s.track.details.slides[index].portion > 0) {
          slide.style.opacity = '1'
        } else {
          slide.style.opacity = '.5'
        }
      })
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 1.5, spacing: 32 },
      },
      '(min-width: 768px)': {
        slides: { perView: 2.5, spacing: 32 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 32 },
      },
      '(min-width: 1280px)': {
        slides: { perView: 5, spacing: 32 },
      },
      '(min-width: 1540px)': {
        slides: { perView: 6, spacing: 32 },
      },
    },
    slides: { perView: 1.5, spacing: 32 },
  },
  [wheelControls]
)

const sliderSettings = computed(() => {
  if (slider.value) {
    const { track, options, slides } = slider.value
    const abs = Number(track.details.abs)
    const perView = Number(options.slides.perView)
    const leftArrowValid = abs !== 0
    const rightArrowValid = abs + perView < slides.length
    const leftCarouselIndex = Math.max(abs - props.step, 0)
    const rightCarouselIndex = Math.min(
      abs + props.step,
      slides.length - perView
    )

    return {
      leftArrowValid,
      rightArrowValid,
      leftCarouselIndex,
      rightCarouselIndex,
    }
  } else {
    return {}
  }
})
</script>

<style scoped lang="scss">
// avoid fouc on navigating
@media screen and (min-width: 768px) {
  @for $i from 0 through 3 {
    .keen-slider__slide:nth-child(#{$i + 1}) {
      min-width: 312px;
      max-width: 312px;
      transform: translate3d(#{$i * 32px}, 0px, 0px);
    }
  }
}
.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease;
}
</style>
