<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <ExploreTabsFilterSort />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <Error
            v-if="$nuxt.isOffline"
            :has-img="false"
            error-subtitle="Please check your network connections"
            error-title="Offline Detected" />
          <Nuxt v-else />
        </div>
      </section>
    </main>
    <LazyTheFooter />
  </div>
</template>

<script lang="ts">
import ExploreTabsFilterSort from '@/components/shared/exploreTabsFilterSort/ExploreTabsFilterSort.vue'

export default {
  name: 'ExploreLayout',
  components: { ExploreTabsFilterSort },
  head() {
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.public.baseUrl + this.$route.path,
        },
      ],
    }
  },
}
</script>
