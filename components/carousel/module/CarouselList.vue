<template>
  <div class="carousel-agnostic">
    <div class="navigation-wrapper">
      <div ref="wrapper" class="keen-slider">
        <div
          v-for="(item, index) in nfts"
          :key="`${item.id}-${index}`"
          class="keen-slider__slide carousel-item">
          <div>
            <nuxt-link :to="urlOf({ id: item.id, url })">
              <PreviewMediaResolver
                v-if="item.animationUrl"
                :src="item.animationUrl"
                :poster="item.image || ''"
                :metadata="item.metadata" />
              <BasicImage
                v-else
                :src="item.image"
                :alt="item.name"
                custom-class="carousel__image-wrapper" />
            </nuxt-link>

            <div class="carousel-info">
              <p>{{ item.name }}</p>
              <p>{collection.name}</p>

              <div v-if="item.price" class="carousel-meta">
                <Money :value="item.price" />
                <div>{{ urlPrefix }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg
        v-if="current !== 0"
        :class="{
          arrow: true,
          'arrow--left': true,
        }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        @click="slider.prev()">
        <path
          d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"></path>
      </svg>
      <svg
        v-if="slider"
        :class="{
          arrow: true,
          'arrow--right': true,
        }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        @click="slider.next()">
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path>
      </svg>
    </div>
    <div v-if="slider" class="dots">
      <button
        v-for="(_slide, idx) in dotHelper"
        :key="idx"
        :class="{ dot: true, active: current === idx }"
        @click="slider.moveToIdx(idx)"></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'

import PreviewMediaResolver from '@/components/media/PreviewMediaResolver.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import Money from '@/components/shared/format/Money.vue'

import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  nfts: CarouselNFT[]
}>()

const { urlOf } = useCarouselUrl()
const { urlPrefix } = usePrefix()

const url = inject('itemUrl') as string
const wrapper = ref<HTMLElement>()
const slider = ref()
const current = ref(0)

const dotHelper = computed(() =>
  slider.value
    ? [...Array(slider.value.track.details.slides.length).keys()]
    : []
)

onMounted(() => {
  console.log(props.nfts)
  if (wrapper.value && props.nfts.length) {
    slider.value = new KeenSlider(wrapper.value, {
      initial: current.value,
      breakpoints: {
        '(min-width: 400px)': {
          slides: { perView: 2, spacing: 5 },
        },
        '(min-width: 1000px)': {
          slides: { perView: 4, spacing: 10 },
        },
      },
      slides: { perView: 1 },
      slideChanged: (s) => {
        current.value = s.track.details.rel
      },
    })
  }
})
</script>

<style lang="scss">
.carousel-agnostic {
  .carousel-item {
    background-color: white;
    color: black;
    border: 1px solid black;
  }

  .carousel-info {
    padding: 1rem;
  }

  .carousel-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
}

.navigation-wrapper {
  position: relative;
}

.dots {
  display: flex;
  padding: 2rem 0;
  justify-content: center;
}

.dot {
  border: none;
  width: 10px;
  height: 10px;
  background: #c5c5c5;
  margin: 0 5px;
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
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  fill: #fff;
  cursor: pointer;

  &--left {
    left: 5px;
  }

  &--right {
    left: auto;
    right: 5px;
  }
}
</style>
