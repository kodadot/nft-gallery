<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />

    <main class="is-flex-grow-1">
      <UnlockableCollectionBanner :key="route.path" :type="type" />
      <hr class="text-color my-0" />
      <NuxtPage />
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
    <Buy />
  </div>
</template>

<script lang="ts" setup>
import UnlockableCollectionBanner from '@/components/collection/unlockable/UnlockableCollectionBanner.vue'

const route = useRoute()

const type = computed(() => route.path.split('/').reverse().at(0))
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
hr {
  @include ktheme() {
    background: theme('k-grey');
  }
}
.text-color {
  @include ktheme() {
    background: theme('text-color');
  }
}

@include touch {
  .mobile-padding {
    padding: 0 1rem;
  }
}
</style>
