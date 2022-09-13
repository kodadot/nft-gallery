<template>
  <div>
    <div class="instance">
      <div class="container replace-me">search</div>
    </div>

    <!-- spotlight -->
    <div class="instance instance-blue">
      <div class="container">
        <LazyCarouselTypeSpotlight />
      </div>
    </div>

    <div class="instance instance-accent">
      <div class="container replace-me">top collections</div>
    </div>

    <div class="instance">
      <div class="container">
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

<script lang="ts" setup></script>

<style lang="scss" scoped>
.container {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.instance {
  border-top: 1px solid black;
  padding: 5rem 0;

  // open another PR
  // TODO: add colors to global variable
  &-accent {
    background-color: #ff7ac3;
  }

  &-blue {
    background-color: #6188e7;
  }
}

.dark-mode {
  .instance {
    &-accent,
    &-blue {
      background-color: #1a1718;
    }
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
