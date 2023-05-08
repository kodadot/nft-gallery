<template>
  <div>
    <section class="py-8 instance section-search">
      <LazySearchLanding />
    </section>

    <!-- spotlight -->
    <section v-if="showCarousel" class="py-8 instance">
      <div class="container is-fluid">
        <LazyCarouselTypeSpotlight />
      </div>
    </section>

    <!-- top collections -->
    <section v-if="showCarousel && urlPrefix !== 'ksm'" class="py-8 instance">
      <div class="container is-fluid">
        <LazyTopCollections class="my-5" />
      </div>
    </section>

    <section v-if="showCarousel" class="py-8 instance">
      <div class="container is-fluid">
        <!-- new listings -->
        <LazyCarouselTypeNewestList />

        <!-- latest sales -->
        <LazyCarouselTypeLatestSales class="mt-8" />
      </div>
    </section>

    <section class="py-8 instance instance-accent">
      <div class="container is-fluid footer-landing-container">
        <LazyFeaturedArticles />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Prefix } from '@/libs/static'

const prefixes: Prefix[] = ['rmrk', 'ksm', 'snek', 'bsx']
const { urlPrefix } = usePrefix()

// currently only supported on rmrk and snek
const showCarousel = computed(() => prefixes.includes(urlPrefix.value))
</script>
