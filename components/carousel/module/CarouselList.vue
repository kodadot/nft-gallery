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
              <nuxt-link
                :to="urlOf({ id: item.id, url })"
                class="has-text-weight-bold carousel-info-name">
                {{ item.name }}
              </nuxt-link>

              <!-- TODO: collection name -->
              <!-- <p>{collection.name}</p> -->

              <div v-if="item.price" class="carousel-meta">
                <Money :value="item.price" class="has-text-weight-bold" />
                <p class="is-size-7">{{ urlPrefix }}</p>
              </div>
            </div>
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
    <div v-if="slider" class="dots">
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

import PreviewMediaResolver from '@/components/media/PreviewMediaResolver.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import Money from '@/components/shared/format/Money.vue'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue.es'
import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  nfts: CarouselNFT[]
}>()

const url = inject('itemUrl') as string
const current = ref(0)

const { urlOf } = useCarouselUrl()
const { urlPrefix } = usePrefix()
const [wrapper, slider] = useKeenSlider({
  initial: current.value,
  slideChanged: (s) => {
    current.value = s.track.details.rel
  },
  breakpoints: {
    '(min-width: 400px)': {
      slides: { perView: 2.5, spacing: 32 },
    },
    '(min-width: 1000px)': {
      slides: { perView: 4.5, spacing: 32 },
    },
  },
  slides: { perView: 1, spacing: 32 },
})

const dotHelper = computed(() =>
  slider.value
    ? [...Array(slider.value.track.details.slides.length - 3).keys()] // TODO: dynamic breakpoints
    : []
)

onMounted(() => {
  console.log(props.nfts)
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
    border-top: 1px solid black;
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
    }
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
  width: 60px;
  height: 60px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  fill: #fff;
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
}
</style>
