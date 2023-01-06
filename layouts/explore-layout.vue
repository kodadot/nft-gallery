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
import { Component, Vue } from 'nuxt-property-decorator'

@Component<ExploreLayout>({
  name: 'ExploreLayout',
  head() {
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.baseUrl + this.$route.path,
        },
      ],
    }
  },
  components: {
    ExploreTabsFilterSort: () =>
      import(
        '@/components/shared/exploreTabsFilterSort/exploreTabsFilterSort.vue'
      ),
  },
})
export default class ExploreLayout extends Vue {}
</script>
