<template>
  <div class="carousel-agnostic">
    <div class="relative">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in items"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide">
          <slot :item="item" :index="index" />
        </div>
      </div>
      <Transition name="fade">
        <button
          v-if="leftArrowValid"
          class="button justify-center arrow arrow-left arrow-icon rounded-full"
          @click="slider?.moveToIdx(leftCarouselIndex)">
          <NeoIcon icon="chevron-left" size="medium" />
        </button>
      </Transition>
      <Transition name="fade">
        <button
          v-if="rightArrowValid"
          class="button justify-center arrow arrow-right arrow-icon rounded-full"
          @click="slider?.moveToIdx(rightCarouselIndex)">
          <NeoIcon icon="chevron-right" size="medium" />
        </button>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue'
import { CarouselWheelsPlugin } from '../utils/useCarousel'
import { NeoIcon } from '@kodadot1/brick'

type CarouseBreakpoints = '640px' | '768px' | '1024px' | '1280px' | '1540px'

export type CarouselConfig = { slides: { perView: number; spacing: number } }

export type CarouseBreakpointsConfig = Record<
  CarouseBreakpoints,
  CarouselConfig
>

const SYNC_SLIDER_ON_EVENTS = ['slideChanged', 'optionsChanged']
const SYNC_CONFIG_DEBOUNCE_AMOUNT = 1 // anything bellow this makes the carousel to glitch
const DEFAULT_SLIDES_CONFIG = { perView: 3, spacing: 16 }

const props = defineProps<{
  items: any[]
  step?: number
  breakpoints?: CarouseBreakpointsConfig
  config?: CarouselConfig
}>()

const current = ref(0)
const leftArrowValid = ref(false)
const rightArrowValid = ref(false)
const leftCarouselIndex = ref(0)
const rightCarouselIndex = ref(0)

const updateSliderArrows = (slider) => {
  if (slider) {
    const { track, options, slides } = slider

    if (!track.details) {
      return console.warn('[SLIDER] Slider is disabled or not ready')
    }

    const abs = Number(track.details.abs)
    const perView = Number(options.slides.perView)

    leftArrowValid.value = abs !== 0
    rightArrowValid.value = abs + perView < slides.length
    leftCarouselIndex.value = Math.max(
      props.step ? abs - props.step : abs - perView,
      0,
    )
    rightCarouselIndex.value = Math.min(
      props.step ? abs + props.step : abs + perView,
      slides.length - perView,
    )
  }
}

const [wrapper, slider] = useKeenSlider(
  {
    initial: current.value,
    rubberband: false,
    created: (s) => {
      updateSliderArrows(s)
    },
    slideChanged: (s) => {
      current.value = s.track.details.rel
      updateSliderArrows(s)
    },
    detailsChanged: (s) => updateSlidesOpacity(s),
    breakpoints: props.breakpoints
      ? {
          '(min-width: 640px)': props.breakpoints['640px'],
          '(min-width: 768px)': props.breakpoints['768px'],
          '(min-width: 1024px)': props.breakpoints['1024px'],
          '(min-width: 1280px)': props.breakpoints['1280px'],
          '(min-width: 1540px)': props.breakpoints['1540px'],
        }
      : undefined,
    slides: props.breakpoints?.['640px'].slides || {
      perView: props.config?.slides.perView || DEFAULT_SLIDES_CONFIG.perView,
      spacing: DEFAULT_SLIDES_CONFIG.spacing,
    },
  },
  [CarouselWheelsPlugin],
)

const updateSlidesOpacity = (s) => {
  s.slides.forEach((slide, index) => {
    if (s.track.details.slides[index].portion > 0) {
      slide.style.opacity = '1'
    } else {
      slide.style.opacity = '.5'
    }
  })
}

const syncSlider = (s) => {
  updateSlidesOpacity(s)
  updateSliderArrows(s)
}

const updateConfig = () => slider.value?.update(props.config)

if (props.config) {
  watch(
    slider,
    (s) => {
      if (s) {
        SYNC_SLIDER_ON_EVENTS.forEach((event) => {
          s.on(event, () => syncSlider(s))
        })
      }
    },
    { immediate: true },
  )

  onMounted(updateConfig)

  watchDebounced([() => props.config, () => props.items.length], updateConfig, {
    debounce: SYNC_CONFIG_DEBOUNCE_AMOUNT,
  })
}
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
