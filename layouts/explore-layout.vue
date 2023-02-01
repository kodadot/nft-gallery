<template>
  <div class="min-h-full is-flex is-flex-direction-column is-clipped">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <Error
            v-if="$nuxt.isOffline"
            :has-img="false"
            error-subtitle="Please check your network connections"
            error-title="Offline Detected" />
          <div v-else>
            <h1 class="title">{{ $t('explore') }}</h1>
            <ExploreTabsFilterSort />

            <Nuxt />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import ExploreTabsFilterSort from '@/components/explore/ExploreIndex.vue'

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
