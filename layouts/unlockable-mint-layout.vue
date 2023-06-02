<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />

    <main class="is-flex-grow-1">
      <CollectionBanner :key="route.path" />
      <hr class="text-color my-0" />
      <Nuxt />
    </main>
    <LazyTheFooter />
    <LazyCookieBanner />
  </div>
</template>

<script lang="ts" setup>
import CollectionBanner from '@/components/collection/unlockable/CollectionBanner.vue'
import CollectionInfo from '@/components/collection/unlockable/CollectionInfo.vue'

const { $config } = useNuxtApp()
const route = useRoute()

useNuxt2Meta({
  title: 'Unlockable',
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
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
