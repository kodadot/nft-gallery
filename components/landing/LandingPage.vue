<template>
  <div>
    <section class="section instance">
      <LazySearchLanding />
    </section>

    <!-- spotlight -->
    <section v-if="showCarousel" class="section instance instance-blue">
      <div class="container">
        <LazyCarouselTypeSpotlight />
      </div>
    </section>

    <!-- top collections -->
    <section v-if="showCarousel" class="section instance instance-accent">
      <div class="container">
        <LazyReTopCollections class="my-5" />
      </div>
    </section>

    <section v-if="showCarousel" class="section instance">
      <div class="container">
        <!-- new listings -->
        <LazyCarouselTypeNewestList />

        <!-- latest sales -->
        <LazyCarouselTypeLatestSales class="mt-6" />
      </div>
    </section>

    <section class="section instance instance-accent">
      <div class="container replace-me">featured articles</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix } = usePrefix()

// currently only supported on rmrk and snek
const showCarousel = computed(() => {
  return urlPrefix.value === 'rmrk' || urlPrefix.value === 'snek'
})
</script>

<style lang="scss" scoped>
// sample
.replace-me {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}
</style>
