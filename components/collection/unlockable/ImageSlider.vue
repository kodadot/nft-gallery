<template>
  <div class="unlockable-image-slider mt-6">
    <div
      class="unlockable-image-tip border px-4 py-2 theme-background-color has-z-index-1 no-wrap">
      {{ title || $t('mint.unlockable.imageTip') }}
    </div>
    <div ref="container" class="keen-slider">
      <img
        v-for="image in imageList"
        :key="image"
        :src="image"
        class="keen-slider__slide" />
    </div>
    <template v-if="imageList.length > 1">
      <Transition name="fade">
        <div
          class="arrow arrow-left arrow-small-size"
          @click="slider?.moveToIdx(sliderSettings.leftCarouselIndex)" />
      </Transition>
      <Transition name="fade">
        <div
          class="arrow arrow-right arrow-small-size"
          @click="slider?.moveToIdx(sliderSettings.rightCarouselIndex)" />
      </Transition>
      <div ref="thumbnail" class="keen-slider thumbnail">
        <div v-for="image in imageList" :key="image" class="keen-slider__slide">
          <img :src="image" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
const emit = defineEmits(['select'])

const props = defineProps<{
  imageList: string[]
  title?: string
}>()

function ThumbnailPlugin(main) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active')
      })
    }
    function addActive(idx) {
      slider.slides[idx].classList.add('active')
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          main.value.moveToIdx(idx)
          emit('select', props.imageList[idx])
        })
      })
    }

    slider.on('created', () => {
      addActive(slider.track.details.rel)
      addClickEvents()
      main.value.on('animationStarted', () => {
        removeActive()
        const next = main.value.animator.targetIdx || 0
        addActive(main.value.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

const [container, slider] = useKeenSlider({
  loop: true,
})
const [thumbnail] = useKeenSlider(
  {
    initial: 0,
    slides: {
      perView: 4,
      spacing: 10,
    },
  },
  [ThumbnailPlugin(slider)],
)

const sliderSettings = computed(() => {
  if (slider.value) {
    const { track, slides } = slider.value
    const abs = Number(track.details.abs)
    const perView = Number(4)
    const leftArrowValid = abs !== 0
    const rightArrowValid = abs + perView < slides.length
    const leftCarouselIndex = (abs - 1 + perView) % perView
    const rightCarouselIndex = (abs + 1) % perView

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
@import '@/assets/styles/abstracts/variables';
@import '@/assets/styles/components/carousel-arrows';

.unlockable-image-slider {
  width: 580px;
  position: relative;

  @include mobile {
    width: 100% !important;
    height: 100% !important;
    max-width: 560px;
  }
  @include tablet-only {
    width: 768px;
  }
  img {
    @include ktheme() {
      border: 1px solid theme('border-color');
    }
  }

  .unlockable-image-tip {
    border-radius: 3rem;
    position: absolute;
    left: 26px;
    top: -14px;
    @include mobile {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .keen-slider__slide {
    height: 580px;
    width: 580px;
    object-fit: cover;
    @include tablet-only {
      width: 768px;
      height: 100%;
    }
    @include mobile {
      width: 100%;
      height: 100%;
    }
  }
  .thumbnail .keen-slider__slide {
    margin-top: 10px;
    height: 136px;
    width: 136px;
    @include tablet-only {
      width: calc(768px / 4);
      height: 100%;
    }
    @include mobile {
      width: 25%;
      max-width: 136px;
    }
    img {
      width: 100%;
      height: 100%;
      @include mobile {
        height: min-content;
      }
      object-fit: cover;
      &:hover {
        opacity: 0.8;
      }
    }
    &.active {
      img {
        @include ktheme() {
          border: 3px solid theme('k-blue');
        }
      }
    }
  }
}
.arrow {
  display: block;
  height: 40px;
  &-left {
    left: 10px;
    top: 34%;
  }
  &-right {
    right: 10px;
    top: 34%;
  }
}
</style>
