<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <MobileFilter />
    <Navbar />

    <main class="is-flex-grow-1">
      <Error
        v-if="$nuxt.isOffline"
        :has-img="false"
        error-subtitle="Please check your network connections"
        error-title="Offline Detected" />
      <div v-else>
        <!-- new header component for collection here -->
        <div v-if="isCollection">
          <CollectionBanner />
          <section class="pt-5">
            <div class="container is-fluid mobile-padding">
              <CollectionInfo />
              <hr class="mb-0" />
            </div>
          </section>
        </div>
        <section class="explore-header">
          <div class="container is-fluid">
            <h1 v-if="isExplore" class="title">{{ $t('explore') }}</h1>

            <ExploreTabsFilterSort />
          </div>
        </section>
        <hr class="text-color my-0" />
        <Nuxt />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/Controls.vue'
import MobileFilter from '@/components/shared/filters/MobileFilter.vue'
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

.explore-header {
  padding: 2.5rem 0;
}
</style>
