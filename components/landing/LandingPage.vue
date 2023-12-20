<template>
  <div>
    <section class="instance">
      <LandingMobileHeroBanner v-if="isMobile" class="mt-6" />
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
          <LandingTopCollections class="my-5" />
        </div>
      </section>

      <section class="py-8 instance">
        <div class="container is-fluid">
          <!-- generative  -->
          <LazyCarouselTypeGenerative class="mt-8" />

          <!-- latest sales -->
          <LazyCarouselTypeLatestSales class="mt-8" />

          <!-- new listings -->
          <LazyCarouselTypeNewestList class="mt-8" />
        </div>
      </section>
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
import CarouselTypeSpotlight from '@/components/carousel/CarouselTypeSpotlight.vue'
import { usePreferencesStore } from '@/stores/preferences'

const hiddenCarrouselPrefixes: Prefix[] = ['dot']
const forbiddenPrefixesForTopCollections: Prefix[] = ['ksm', 'dot']

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const { width } = useWindowSize()

const showSignupBanner = computed(
  () => !preferencesStore.getSubscribedToNewsletter,
)
// currently only supported on rmrk
const showCarousel = computed(
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value),
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value),
)
const isMobile = computed(() => width.value <= 480)
</script>
