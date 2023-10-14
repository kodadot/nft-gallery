<template>
  <div class="slide">
    <div ref="wrapper" class="keen-slider">
      <div v-for="faq in faqs" :key="faq.title" class="keen-slider__slide">
        <div class="faq">
          <p class="faq-title">{{ faq.title }}</p>
          <p class="faq-desc">{{ faq.desc }}</p>
        </div>
      </div>
    </div>

    <NeoIcon
      class="slide-arrow slide-arrow-left"
      icon="chevron-left"
      @click="slider?.prev()" />
    <NeoIcon
      class="slide-arrow slide-arrow-right"
      icon="chevron-right"
      @click="slider?.next()" />

    <div class="slide-pin">FAQ</div>
    <div class="slide-number">{{ slide + 1 }} / {{ slideLength }}</div>
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

const faqs = [
  {
    title: 'What is Migration?',
    desc: `Migration is the process of safely transferring your NFTs/collection
          from Kusama to Polkadot/kusama Asset Hub along with all their embedded
          information such as ownership records and transaction history. This
          ensures your NFTs maintain their value and authenticity on the new
          platform. Importantly, once completed, this action is irreversible.`,
  },
  {
    title: 'How to Migrate?',
    desc: `With our tool, migrating your NFTs to Polkadot/kusama Asset Hub is
          just a few steps away. Select your collection or items Review all
          details in the overview. Initiate the migration process. Sign all
          required transactions.`,
  },
  {
    title: 'what are the costs?',
    desc: `The cost depends on:
Destination blockchain - Fees differ between Polkadot Asset Hub and Kusama Asset Hub.
Number of items - Migrating more NFTs incurs higher overall costs.

An estimate specific to your migration is provided on the overview page before signing`,
  },
  {
    title: 'learn more about process',
    desc: 'For a detailed look at our migration process, check out our help article on initiating and completing NFT transfers. This guide covers requirements, fees, and more.',
  },
]
</script>

<style lang="scss" scoped>
.slide {
  position: relative;

  &-pin {
    border-radius: 4.625rem;
    border: 1px solid var(--text, #000);
    background: var(--background, #fff);
    line-height: 1;
    padding: 0.5rem 0.625rem;
    position: absolute;
    top: calc(-34px / 2);
    left: calc(-52px / 2);
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
    z-index: 1;

    &-left {
      left: 1.25rem;
    }

    &-right {
      right: 1.25rem;
    }
  }
}

.keen-slider {
  border: 1px solid black;
}

.faq {
  padding: 2rem 3.75rem;

  &-title {
    font-weight: bold;
    margin-bottom: 1rem;
    text-transform: capitalize;
  }
}
</style>
