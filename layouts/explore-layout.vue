<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <MobileFilter />
    <Navbar />

    <!-- new header component for collection here -->
    <div v-if="isCollection">header collection here</div>

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
            <div v-if="$route.query.search">
              {{ $t('general.searchResultsText') }}
              <span class="text__stroked is-size-3">{{
                $route.query.search
              }}</span>
            </div>
          </div>
        </section>
        <hr class="m-0" />
        <section class="section pt-0">
          <Nuxt />
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import ExploreTabsFilterSort from '@/components/explore/ExploreIndex.vue'
import MobileFilter from '@/components/explore/MobileFilter.vue'

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
const isCollection = computed(() => route.name === 'prefix-collection-id')
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
hr {
  @include ktheme() {
    background: theme('border-color');
  }
}
</style>
