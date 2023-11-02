<template>
  <div>
    <section class="instance">
      <MobileLanding v-if="isMobile" class="mt-6" />
      <SearchLanding v-else class="my-8" />
    </section>

    <template v-if="showCarousel">
      <!-- spotlight -->
      <section class="py-8 instance">
        <div class="container is-fluid">
          <CarouselTypeSpotlight />
        </div>
      </section>

      <!-- email signup banner -->
      <transition name="slide">
        <section v-if="showSignupBanner" class="py-5 instance">
          <div class="container is-fluid">
            <LandingSignupBanner class="my-4" />
          </div>
        </section>
      </transition>

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
import MobileLanding from '~/components/landing/MobileLanding.vue'
import SearchLanding from './SearchLanding.vue'
import TopCollections from './topCollections/TopCollections.vue'
import CarouselTypeSpotlight from '@/components/carousel/CarouselTypeSpotlight.vue'
import { usePreferencesStore } from '@/stores/preferences'

const hiddenCarrouselPrefixes: Prefix[] = ['dot']
const forbiddenPrefixesForTopCollections: Prefix[] = [
  'ksm',
  'ahk',
  'ahp',
  'dot',
]

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()

const showSignupBanner = computed(
  () => !preferencesStore.getSubscribedToNewsletter,
)
// currently only supported on rmrk and snek
const showCarousel = computed(
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value),
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value),
)
const isMobile = computed(() => useWindowSize().width.value <= 480)
</script>
