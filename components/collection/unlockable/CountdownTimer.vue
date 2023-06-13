<template>
  <div ref="wrapper" class="px-4 py-4 keen-slider">
    <div
      v-for="(section, index) in [1, 2, 3, 4]"
      :key="index"
      class="keen-slider__slide is-flex no-wrap">
      <div class="no-wrap">
        <span class="mr-4 has-text-grey">Mint Phase Ends In</span
        ><span
          >{{ hours }} Hours : {{ minutes }} Minutes :
          {{ seconds }} Seconds</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue.es'
import { countDownTime } from './const'
import { useCountDown } from './utils/useCountDown'
const animation = { duration: 50000, easing: (t) => t }

const { hours, minutes, seconds } = useCountDown(countDownTime)

const [wrapper] = useKeenSlider({
  loop: true,
  renderMode: 'performance',
  slides: {
    origin: 'center',
    perView: window.innerWidth / 500,
    spacing: 10,
  },
  drag: false,
  created(s) {
    s.moveToIdx(1, true, animation)
  },
  updated(s) {
    s.moveToIdx(s.track.details.abs + 1, true, animation)
  },
  animationEnded(s) {
    s.moveToIdx(s.track.details.abs + 1, true, animation)
  },
})
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
</style>
