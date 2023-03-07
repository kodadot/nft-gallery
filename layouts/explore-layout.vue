<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <MobileFilter />
    <Navbar />

    <!-- new header component for collection here -->
    <div v-if="isCollection">
      <CollectionBanner />
      <section class="container mobile-padding pt-5">
        <CollectionInfo />
        <hr />
      </section>
    </div>

    <main class="is-flex-grow-1">
      <Error
        v-if="$nuxt.isOffline"
        :has-img="false"
        error-subtitle="Please check your network connections"
        error-title="Offline Detected" />
      <div v-else>
        <section class="section">
          <div class="container">
            <h1 v-if="isExplore" class="title">{{ $t('explore') }}</h1>

            <ExploreTabsFilterSort />
          </div>
        </section>
        <hr class="text-color my-0" />
        <section class="section pt-0">
          <Nuxt />
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/Controls.vue'
import MobileFilter from '@/components/explore/MobileFilter.vue'
import CollectionBanner from '@/components/collection/CollectionHeader/CollectionBanner.vue'
import CollectionInfo from '@/components/collection/CollectionInfo.vue'

const { $config } = useNuxtApp()
const route = useRoute()

useNuxt2Meta({
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: $config.public.baseUrl + route.path,
    },
  ],
})

const isExplore = computed(() => route.path.includes('/explore'))
const isCollection = computed(() =>
  route.name?.includes('prefix-collection-id')
)
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
