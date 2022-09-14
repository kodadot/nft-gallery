<template>
  <div class="carousel-agnostic">
    <div class="navigation-wrapper">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in nfts"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide carousel-item">
          <div>
            <CarouselMedia :item="item" />
            <CarouselInfo :item="item" />
          </div>
        </div>
      </div>
      <div
        v-if="current !== 0"
        class="arrow arrow-left"
        @click="slider?.prev()"></div>
      <div
        v-if="current !== dotHelper.length - 1"
        class="arrow arrow-right"
        @click="slider?.next()"></div>
    </div>
    <div v-if="slider && !isCollection" class="dots">
      <button
        v-for="(_slide, idx) in dotHelper"
        :key="idx"
        :class="{ dot: true, active: current === idx }"
        @click="slider?.moveToIdx(idx)"></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'

import CarouselMedia from './CarouselMedia.vue'
import CarouselInfo from './CarouselInfo.vue'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue.es'

const props = defineProps<{
  nfts: CarouselNFT[]
}>()

const url = inject('itemUrl') as string
const isCollection = computed(() => url.includes('collection'))
provide('isCollection', isCollection.value)

const current = ref(0)
const minWidths = [1280, 1024, 768, 640]
const [wrapper, slider] = useKeenSlider({
  initial: current.value,
  slideChanged: (s) => {
    current.value = s.track.details.rel
  },
  breakpoints: {
    '(min-width: 640px)': {
      slides: { perView: 1.5, spacing: 32 },
    },
    '(min-width: 768px)': {
      slides: { perView: 2.5, spacing: 32 },
    },
    '(min-width: 1024px)': {
      slides: { perView: 3.5, spacing: 32 },
    },
    '(min-width: 1280px)': {
      slides: { perView: 4.5, spacing: 32 },
    },
  },
  slides: { perView: 1.5, spacing: 32 },
})
const totalDots = computed(() => {
  const width = window.innerWidth

  for (const [index, breakpoint] of minWidths.entries()) {
    if (breakpoint <= width) {
      const perView = 4.5 - (index + 1)
      return Math.round(props.nfts.length - perView)
    }
  }
})
const dotHelper = computed(() =>
  slider.value ? [...Array(totalDots.value).keys()] : []
)
</script>

<style lang="scss">
.carousel-agnostic {
  .keen-slider {
    padding-bottom: 1rem;
  }

  .carousel-item {
    background-color: white;
    color: black;
    border: 1px solid black;
    box-shadow: 0.25rem 0.25rem 0 0 rgba(255, 255, 255, 0);
    transition-duration: 0.4s;
    transition-property: box-shadow;

    &:hover {
      box-shadow: 0.25rem 0.25rem 0 0 rgba(0, 0, 0, 1);
    }
  }

  .carousel-media {
    border-bottom: 1px solid black;

    &-collection {
      border-bottom: none;
      padding: 1rem 1rem 0 1rem;
    }
  }

  .carousel-info {
    padding: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &-name {
      color: black;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &-collection {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .carousel-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .navigation-wrapper {
    position: relative;
  }

  .dots {
    display: flex;
    padding: 2rem 0;
    justify-content: center;

    @media screen and (max-width: 640px) {
      display: none;
    }
  }

  .dot {
    border: none;
    width: 10px;
    height: 10px;
    background: #c5c5c5;
    margin: 0 0.75rem;
    padding: 5px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &.active {
      background: #000;
    }
  }

  .arrow {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    cursor: pointer;

    &-left {
      left: -30px;

      border-bottom: solid 40px transparent;
      border-top: solid 40px transparent;
      border-right: solid 60px black;

      &::after {
        content: '';
        width: 0;
        height: 0;

        position: absolute;
        border-bottom: solid 36px transparent;
        border-top: solid 36px transparent;
        border-right: solid 55px white;
        top: -36px;
        right: -58px;
        transition-duration: 0.2s;
      }

      &::before {
        content: '';
        width: 0;
        height: 0;

        position: absolute;
        border-bottom: solid 40px transparent;
        border-top: solid 40px transparent;
        border-right: solid 60px black;
        top: -34px;
        right: -56px;
      }
    }

    &-right {
      left: auto;
      right: -30px;

      border-bottom: solid 40px transparent;
      border-top: solid 40px transparent;
      border-left: solid 60px black;

      &::after {
        content: '';
        width: 0;
        height: 0;

        position: absolute;
        border-bottom: solid 36px transparent;
        border-top: solid 36px transparent;
        border-left: solid 55px white;
        top: -36px;
        left: -58px;
        transition-duration: 0.2s;
      }

      &::before {
        content: '';
        width: 0;
        height: 0;

        position: absolute;
        border-bottom: solid 40px transparent;
        border-top: solid 40px transparent;
        border-left: solid 60px black;
        top: -34px;
        left: -56px;
      }
    }

    &:hover {
      &.arrow-left::after {
        border-right: solid 55px #ffe5f3;
      }

      &.arrow-right::after {
        border-left: solid 55px #ffe5f3;
      }
    }

    @media screen and (max-width: 640px) {
      display: none;
    }
  }
}

.dark-mode {
  .carousel-agnostic {
    .carousel-item {
      background-color: #1a1718;
      border: 1px solid white;

      &:hover {
        box-shadow: 0.25rem 0.25rem 0 0 rgba(255, 255, 255, 1);
      }
    }

    .carousel-info-name,
    .carousel-meta {
      color: white;
    }

    .dot.active {
      background-color: white;
    }
  }
}
</style>
