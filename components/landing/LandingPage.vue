<template>
  <div>
    <section class="py-8 instance section-search">
      <LazySearchLanding />
    </section>

    <template v-if="showCarousel">
      <!-- spotlight -->
      <section class="py-8 instance">
        <div class="container is-fluid">
          <LazyCarouselTypeSpotlight />
        </div>
      </section>

      <!-- top collections -->
      <section v-if="showTopCollections" class="py-8 instance">
        <div class="container is-fluid">
          <LazyTopCollections class="my-5" />
        </div>
      </section>

      <section class="py-8 instance">
        <div class="container is-fluid">
          <!-- new listings -->
          <LazyCarouselTypeNewestList />

          <!-- latest sales -->
          <LazyCarouselTypeLatestSales class="mt-8" />
        </div>
      </section>
    </template>

    <section class="py-8 instance instance-accent">
      <div class="container is-fluid footer-landing-container">
        <LazyFeaturedArticles />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@kodadot1/static'

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
  () => !hiddenCarrouselPrefixes.includes(urlPrefix.value)
)
const showTopCollections = computed(
  () => !forbiddenPrefixesForTopCollections.includes(urlPrefix.value)
)
</script>
