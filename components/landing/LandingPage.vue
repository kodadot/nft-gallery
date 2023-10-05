<template>
  <div>
    <section class="py-8 instance section-search">
      <SearchLanding />
    </section>

    <template v-if="showCarousel">
      <!-- spotlight -->
      <section class="py-8 instance">
        <div class="container is-fluid">
          <CarouselTypeSpotlight />
        </div>
      </section>

      <!-- top collections -->
      <section v-if="showTopCollections" class="py-8 instance">
        <div class="container is-fluid">
          <TopCollections class="my-5" />
        </div>
      </section>

      <!-- at the moment lets put Carousel on Client mode only. I suspect that there is some blocked resources on Carousel component. something like async/await process -->
      <ClientOnly>
        <section class="py-8 instance">
          <div class="container is-fluid">
            <!-- new listings -->
            <LazyCarouselTypeNewestList />

            <!-- latest sales -->
            <LazyCarouselTypeLatestSales class="mt-8" />
          </div>
        </section>
      </ClientOnly>
    </template>

    <section class="py-8 instance instance-accent">
      <div class="container is-fluid footer-landing-container">
        <LazyLandingFeaturedArticles />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@kodadot1/static'
import SearchLanding from './SearchLanding.vue'
import TopCollections from './topCollections/TopCollections.vue'
import CarouselTypeSpotlight from '@/components/carousel/CarouselTypeSpotlight.vue'

const hiddenCarrouselPrefixes: Prefix[] = ['dot']
const forbiddenPrefixesForTopCollections: Prefix[] = [
  'ksm',
  'ahk',
  'ahp',
  'dot',
]

const { urlPrefix } = usePrefix()

// currently only supported on rmrk and snek
const showCarousel = computed(
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value),
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value),
)
</script>
