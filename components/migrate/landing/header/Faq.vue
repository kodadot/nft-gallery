<template>
  <div class="slide-faq">
    <div ref="wrapper" class="keen-slider">
      <div v-for="faq in 4" :key="faq" class="keen-slider__slide">
        <div class="faq">
          <p class="faq-title">{{ $t(`migrate.faq.faq${faq}.title`) }}</p>
          <p
            v-dompurify-html="$t(`migrate.faq.faq${faq}.desc`)"
            class="faq-desc"></p>
        </div>
      </div>
    </div>

    <NeoIcon
      class="slide-faq-arrow slide-faq-arrow-left"
      icon="chevron-left"
      @click="slider?.prev()" />
    <NeoIcon
      class="slide-faq-arrow slide-faq-arrow-right"
      icon="chevron-right"
      @click="slider?.next()" />

    <div class="slide-faq-pin">FAQ</div>
    <div class="slide-faq-number">{{ slide + 1 }} / {{ slideLength }}</div>
  </div>
</template>

<script setup lang="ts">
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue'
import { NeoIcon } from '@kodadot1/brick'

const slide = ref(0)
const slideLength = ref(0)
const [wrapper, slider] = useKeenSlider({
  initial: slide.value,
  loop: true,
  created(s) {
    slideLength.value = s.track.details.slides.length
  },
  slideChanged(s) {
    slide.value = s.track.details.rel
  },
})
</script>

<style lang="scss" scoped>
.slide-faq {
  @apply w-full relative;

  &-pin {
    border-radius: 4.625rem;
    line-height: 1;
    padding: 0.5rem 0.625rem;
    position: absolute;
    top: calc(-34px / 2);
    left: calc(-52px / 2);
    @apply border bg-background-color;
  }

  &-number {
    position: absolute;
    top: 2rem;
    right: 3.75rem;
  }

  &-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    @apply z-[1];

    &-left {
      left: 1.25rem;
    }

    &-right {
      right: 1.25rem;
    }
  }
}

.keen-slider {
  @apply border;
}

.faq {
  padding: 2rem 3.75rem;

  &-title {
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: capitalize;
  }
}

:deep(.faq-desc) {
  ol {
    margin-left: 20px;
  }

  ul {
    list-style: unset;
    margin-left: 20px;
  }
}
</style>
