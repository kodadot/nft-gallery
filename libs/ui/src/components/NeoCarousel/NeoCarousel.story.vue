<template>
  <Story title="NeoCarousel" :layout="{ type: 'grid', width: '600px' }">
    <Variant title="NeoCarousel">
      <NeoCarousel>
        <NeoCarouselItem v-for="(carousel, i) in carousels" :key="i">
          <section :class="`bg-[${carousel.color}]`">
            <h1>{{ carousel.text }}</h1>
          </section>
        </NeoCarouselItem>
      </NeoCarousel>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import NeoCarousel from './NeoCarousel.vue'
import NeoCarouselItem from './NeoCarouselItem.vue'

const carousels = [
  { text: 'Slide 1', color: '#445e00' },
  { text: 'Slide 2', color: '#006724' },
  { text: 'Slide 3', color: '#b60000' },
  { text: 'Slide 4', color: '#f4c300' },
  { text: 'Slide 5', color: '#005c98' },
]
</script>
