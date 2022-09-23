<template>
  <div>
    <div class="instance">
      <LazySearchLanding />
    </div>

    <!-- spotlight -->
    <div v-if="showCarousel" class="instance instance-blue">
      <div class="container px-5">
        <LazyCarouselTypeSpotlight />
      </div>
    </div>

    <div class="instance instance-accent">
      <div class="container replace-me">top collections</div>
    </div>

    <div v-if="showCarousel" class="instance">
      <div class="container px-5">
        <!-- new listings -->
        <LazyCarouselTypeNewestList />

        <!-- latest sales -->
        <LazyCarouselTypeLatestSales class="mt-6" />
      </div>
    </div>

    <div class="instance instance-accent">
      <div class="container replace-me">featured articles</div>
    </div>
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
