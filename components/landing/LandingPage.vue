<template>
  <div>
    <section class="instance">
      <LandingHeroBanner />
    </section>

    <template v-if="showCarousel">
      <!-- top collections -->
      <section v-if="showTopCollections" class="py-8 instance">
        <div class="w-full px-[2.5rem]">
          <LandingTopCollections class="my-5" />
        </div>
      </section>

      <section class="py-8 instance">
        <div class="w-full px-[2.5rem]">
          <!-- generative  -->
          <LazyCarouselTypeGenerative />
        </div>
      </section>

      <!-- email signup banner -->
      <transition name="slide">
        <section v-if="showSignupBanner" class="py-5 instance">
          <div class="w-full px-[2.5rem]">
            <LandingSignupBanner class="my-4" />
          </div>
        </section>
      </transition>

      <section class="py-8 instance">
        <div class="w-full px-[2.5rem]">
          <!-- latest sales -->
          <LazyCarouselTypeLatestSales />

          <!-- new listings -->
          <LazyCarouselTypeNewestList class="mt-8" />
        </div>
      </section>
    </template>

    <section class="py-8 instance instance-accent">
      <div class="w-full px-[2.5rem]">
        <LazyLandingFeaturedArticles />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@kodadot1/static'
import { usePreferencesStore } from '@/stores/preferences'

const hiddenCarrouselPrefixes: Prefix[] = ['dot']
const forbiddenPrefixesForTopCollections: Prefix[] = ['ksm', 'dot']

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()

const showSignupBanner = computed(
  () => !preferencesStore.getNewsletterSubscription.subscribed,
)
// currently only supported on rmrk
const showCarousel = computed(
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value),
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value),
)
</script>
