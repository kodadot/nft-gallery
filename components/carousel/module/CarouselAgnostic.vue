<template>
  <div class="carousel-agnostic">
    <div class="navigation-wrapper">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in nfts"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide carousel-item">
          <NuxtLink
            class="h-full flex flex-col"
            :to="urlOf({ id: item.id, url, chain: item.chain })"
            rel="nofollow">
            <CarouselMedia :item="item" :index="index" :length="nfts.length" />
            <slot name="card-info" :item="item">
              <CarouselInfo :item="item" />
            </slot>
          </NuxtLink>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="leftArrowValid"
          class="arrow arrow-left"
          @click="slider?.moveToIdx(leftCarouselIndex)"></div>
      </Transition>
      <Transition name="fade">
        <div
          v-if="rightArrowValid"
          class="arrow arrow-right"
          @click="slider?.moveToIdx(rightCarouselIndex)"></div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CarouselMedia from './CarouselMedia.vue'
import CarouselInfo from './CarouselInfo.vue'
import type { CarouselNFT } from '@/components/base/types'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue'
import { CarouselWheelsPlugin, useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  nfts: CarouselNFT[]
  step: number
}>()
const { urlOf } = useCarouselUrl()

const url = inject('itemUrl', 'gallery') as string
const isCollection = computed(() => url.includes('collection'))
provide('isCollection', isCollection.value)

const current = ref(0)
const leftArrowValid = ref(false)
const rightArrowValid = ref(false)
const leftCarouselIndex = ref(0)
const rightCarouselIndex = ref(0)

const sliderSettings = (slider) => {
  if (slider) {
    const { track, options, slides } = slider
    const abs = Number(track.details.abs)
    const perView = Number(options.slides.perView)

    leftArrowValid.value = abs !== 0
    rightArrowValid.value = abs + perView < slides.length
    leftCarouselIndex.value = Math.max(abs - props.step, 0)
    rightCarouselIndex.value = Math.min(
      abs + props.step,
      slides.length - perView,
    )
  }
}

const [wrapper, slider] = useKeenSlider(
  {
    initial: current.value,
    rubberband: false,
    created: (s) => {
      sliderSettings(s)
    },
    slideChanged: (s) => {
      current.value = s.track.details.rel
      sliderSettings(s)
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
        slides: { perView: 2.2, spacing: 16 },
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
    slides: { perView: 2.2, spacing: 16 },
  },
  [CarouselWheelsPlugin],
)
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
