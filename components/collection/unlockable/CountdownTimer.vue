<template>
  <div ref="wrapper" class="px-4 py-4 keen-slider">
    <div
      v-for="(item, index) in [1, 2, 3]"
      :key="index"
      class="keen-slider__slide mr-4">
      <span class="mr-4 has-text-grey">Mint Phase Ends In</span
      ><span
        >{{ hours }} Hours : {{ minutes }} Minutes : {{ seconds }} Seconds</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue.es'
import { countDownTime } from './const'
const animation = { duration: 20000, easing: (t) => t }

const countDownTime = new Date('Jun 20, 2023 10:00:00').getTime()
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const timer = ref()

const [wrapper] = useKeenSlider({
  loop: true,
  renderMode: 'performance',
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

const countdown = () => {
  // Get today's date and time
  const now = new Date().getTime()

  let distance = countDownTime - now
  hours.value = Math.floor(distance / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

onMounted(() => {
  timer.value = setInterval(countdown, 1000)
})

onBeforeMount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
</style>
