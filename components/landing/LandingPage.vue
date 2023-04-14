<template>
  <div>
    <section class="py-6 instance section-search">
      <LazySearchLanding />
    </section>

    <!-- spotlight -->
    <section v-if="showCarousel" class="py-6 instance">
      <div class="container is-fluid">
        <LazyCarouselTypeSpotlight />
      </div>
    </section>

    <!-- top collections -->
    <section v-if="showCarousel && urlPrefix !== 'ksm'" class="py-6 instance">
      <div class="container is-fluid">
        <LazyTopCollections class="my-5" />
      </div>
    </section>

    <section v-if="showCarousel" class="py-6 instance">
      <div class="container is-fluid">
        <!-- new listings -->
        <LazyCarouselTypeNewestList />

        <!-- latest sales -->
        <LazyCarouselTypeLatestSales class="mt-6" />
      </div>
    </section>

    <section class="py-6 instance instance-accent">
      <div class="container is-fluid footer-landing-container">
        <LazyFeaturedArticles />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix } = usePrefix()

// currently only supported on rmrk and snek
const showCarousel = computed(() => {
  return (
    urlPrefix.value === 'rmrk' ||
    urlPrefix.value === 'ksm' ||
    urlPrefix.value === 'snek' ||
    urlPrefix.value === 'bsx'
  )
})
</script>
