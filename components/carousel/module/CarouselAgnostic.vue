<template>
  <div class="carousel-agnostic">
    <div class="relative">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in items"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide carousel-item">
          <slot :item="item" :index="index" />
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
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue'
import { CarouselWheelsPlugin } from '../utils/useCarousel'

type CarouseBreakpoints = '640px' | '768px' | '1024px' | '1280px' | '1540px'

export type CarouseBreakpointsConfig = Record<
  CarouseBreakpoints,
  { slides: { perView: number; spacing: number } }
>

const props = defineProps<{
  items: any[]
  step: number
  breakpoints: CarouseBreakpointsConfig
}>()

const current = ref(0)
const leftArrowValid = ref(false)
const rightArrowValid = ref(false)
const leftCarouselIndex = ref(0)
const rightCarouselIndex = ref(0)

const sliderSettings = (slider) => {
  if (slider) {
    console.log('slider ', slider)

    const { track, options, slides } = slider

    if (!track.details) {
      return console.warn('[SLIDER] Slider is disabled or not ready')
    }

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
      console.log('slide change')
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
      '(min-width: 640px)': props.breakpoints['640px'],
      '(min-width: 768px)': props.breakpoints['768px'],
      '(min-width: 1024px)': props.breakpoints['1024px'],
      '(min-width: 1280px)': props.breakpoints['1280px'],
      '(min-width: 1540px)': props.breakpoints['1540px'],
    },
    slides: props.breakpoints['640px'].slides,
  },
  [CarouselWheelsPlugin],
)
</script>

<style scoped lang="scss">
// avoid fouc on navigating
// @media screen and (min-width: 768px) {
//   @for $i from 0 through 3 {
//     .keen-slider__slide:nth-child(#{$i + 1}) {
//       min-width: 312px;
//       max-width: 312px;
//       transform: translate3d(#{$i * 32px}, 0px, 0px);
//     }
//   }
// }
.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s ease;
}
</style>
