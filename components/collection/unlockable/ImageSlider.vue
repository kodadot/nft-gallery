<template>
  <div class="unlockable-image-slider">
    <div ref="container" class="keen-slider">
      <img
        v-for="image in imageList"
        :key="image"
        :src="image"
        class="keen-slider__slide" />

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
    <div ref="thumbnail" class="keen-slider thumbnail">
      <div v-for="image in imageList" :key="image" class="keen-slider__slide">
        <img :src="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
const imageList = [
  'https://replicate.delivery/pbxt/PyQofrsc39W0LCzBel4ofvwStvZinbywkMoH1aNZ9wwer5EEB/out-0.png',
  'https://replicate.delivery/pbxt/PtCm0mP3PBY5BdYKo1kqwmMmlgZl4V9uZzeGC5K624z7MngIA/out-0.png',
  'https://replicate.delivery/pbxt/7900WedrZPyzFK5VI8Sb4K0NZ1JEt6TMRf2XpT1EBSmOaOBRA/out-0.png',
  'https://replicate.delivery/pbxt/xZ6WzuO5VNqFJNhgMwR4mpE3COFh8GRpkSio3NvQdLdmDOQE/out-0.png',
  'https://replicate.delivery/pbxt/Cxfhi4qeTNvn6kcrrKlvL1YUPBKeAmbNrrf2ATtPVd6o5gDEB/out-1.png',
  'https://replicate.delivery/pbxt/JRefeymjem3mpQY4fHABatiApzEoJhSxzFXvf5zD00dnmDOQE/out-2.png',
  'https://replicate.delivery/pbxt/oxnUi6H6sqa3G94GLgmN9gnFrmce5agGMlOqV6vfd5xbO4ARA/out-3.png',
  'https://replicate.delivery/pbxt/T11jVf2EUExMdCqnjx5xH72WWWPedvZM82RrEbaADq8CaOBRA/out-0.png',
  'https://replicate.delivery/pbxt/pamnM0QmQTbaDZasPiOievPg0ekfW2X2B23WbsuqgeveobHIC/out-0.png',
  'https://replicate.delivery/pbxt/9sfHL1QbXjUGZqvJZBfyS90ZVR1souUUL03QsVWTYxPId7ARA/out-1.png',
  'https://replicate.delivery/pbxt/m2MagsaOVSYuMxbgv32b3bDaTtD0ZCVaA17eRO42KklkudgIA/out-2.png',
]
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

const [container, slider] = useKeenSlider({})
const [thumbnail] = useKeenSlider(
  {
    initial: 0,
    slides: {
      perView: 4,
      spacing: 1,
    },
  },
  [ThumbnailPlugin(slider)]
)

const sliderSettings = computed(() => {
  if (slider.value) {
    const { track, options, slides } = slider.value
    const abs = Number(track.details.abs)
    const perView = Number(4)
    const leftArrowValid = abs !== 0
    const rightArrowValid = abs + perView < slides.length
    const leftCarouselIndex = Math.max(abs - 1, 0)
    const rightCarouselIndex = Math.min(abs + 1, slides.length - perView)

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
@import '@/styles/abstracts/variables';

.unlockable-image-slider {
  width: 580px;
  img {
    @include ktheme() {
      border: 1px solid theme('border-color');
    }
  }
  .keen-slider__slide {
    height: 580px;
    width: 580px;
  }
  .thumbnail .keen-slider__slide {
    margin-top: 10px;
    height: 136px;
    width: 136px;
    img {
      height: 136px;
      width: 136px;
    }
  }
}
</style>
