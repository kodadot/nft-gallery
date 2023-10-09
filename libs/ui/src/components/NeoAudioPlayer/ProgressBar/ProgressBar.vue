<template>
  <div
    ref="progressbar"
    class="progressbar"
    :class="{
      progressbar__rounded: rounded,
    }"
    @click="onClick">
    <div
      class="progressbar-progress"
      :style="{ width: `${currentPercent}%` }" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

const emit = defineEmits(['change'])

const props = defineProps<{
  currentTime: number
  totalTime: number
  rounded?: boolean
}>()

const progressbar = ref()
const progressbarWidth = ref(0)

const currentPercent = computed(
  () => (props.currentTime / props.totalTime) * 100,
)

const onClick = (event: MouseEvent) => {
  const percent = (event.offsetX / progressbarWidth.value) * 100
  const toTime = (percent / 100) * props.totalTime
  emit('change', toTime)
}

useResizeObserver(progressbar, (entry) => {
  progressbarWidth.value = entry[0].contentRect.width
})
</script>
<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.progressbar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;

  @include ktheme() {
    border: 1px solid theme('border-color');
    background-color: theme('background-color');
  }

  &__rounded {
    border-radius: 10px;
  }

  &-progress {
    position: relative;
    display: block;
    height: 100%;

    transition: width 0.3s ease-in-out;

    @include ktheme() {
      background-color: theme('background-color-inverse');
    }
  }
}
</style>
