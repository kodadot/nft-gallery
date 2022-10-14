<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar v-if="redesign" />
    <NavbarOld v-else />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <Error
            v-if="$nuxt.isOffline"
            :has-img="false"
            error-title="Offline Detected"
            error-subtitle="Please check your network connections" />
          <Nuxt v-else />
        </div>
      </section>
    </main>
    <LazyTheFooterOld />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
@Component<DefaultLayout>({
  name: 'DefaultLayout',
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
})
export default class DefaultLayout extends mixins(ExperimentMixin) {}
</script>
