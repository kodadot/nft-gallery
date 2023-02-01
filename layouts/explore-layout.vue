<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <main class="is-flex-grow-1">
      <Error
        v-if="$nuxt.isOffline"
        :has-img="false"
        error-subtitle="Please check your network connections"
        error-title="Offline Detected" />
      <div v-else>
        <section class="section">
          <div class="container">
            <h1 class="title">{{ $t('explore') }}</h1>
            <ExploreTabsFilterSort />
          </div>
        </section>
        <hr class="m-0" />
        <Nuxt />
      </div>
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
