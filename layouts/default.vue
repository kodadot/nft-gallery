<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <!--    <MobileNavbar v-else />-->
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
import { isMobileDevice } from '@/utils/extension'
import { Component, Vue } from 'nuxt-property-decorator'

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
export default class DefaultLayout extends Vue {
  private isMobile = isMobileDevice
}
</script>
