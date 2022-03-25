<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <Error
            v-if="$nuxt.isOffline"
            :hasImg="false"
            errorTitle="Offline Detected"
            errorSubtitle="Please check your network connections" />
          <Nuxt v-else />
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Error from '@/components/shared/Error.vue'
@Component({
  components: { Error },
})
export default class DefaultLayout extends Vue {}
</script>
