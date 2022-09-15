<template>
  <div>
    <div class="instance">
      <LazySearchLanding />
    </div>

    <!-- spotlight -->
    <div class="instance instance-blue">
      <div class="container">
        <!-- open another PR -->
        <!-- TODO: change popular collection with spotlight -->
        <CarouselTypePopularCollection />
      </div>
    </div>

    <div class="instance instance-accent">
      <div class="container replace-me">top collections</div>
    </div>

    <div class="instance">
      <div class="container">
        <!-- new listings -->
        <CarouselTypeNewestList />

        <!-- latest sales -->
        <CarouselTypeLatestSales />
      </div>
    </div>

    <div class="instance instance-accent">
      <div class="container replace-me">featured articles</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Search from '@/components/search/Search.vue'
import CarouselTypeLatestSales from '@/components/carousel/CarouselTypeLatestSales.vue'
import CarouselTypeNewestList from '@/components/carousel/CarouselTypeNewestList.vue'
import CarouselTypePopularCollection from '@/components/carousel/CarouselTypePopularCollection.vue'
</script>

<style lang="scss" scoped>
.instance {
  border-top: 1px solid black;
  padding: 5rem 0;
  position: relative;

  // open another PR
  // TODO: add colors to global variable
  &-accent {
    background-color: #ff7ac3;
  }

  &-blue {
    background-color: #6188e7;
  }
}

// sample
.replace-me {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}
</style>
