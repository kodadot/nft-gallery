<template>
  <div class="min-h-full is-flex is-flex-direction-column">
    <Navbar v-if="isNavbarVisible" />
    <main class="is-flex-grow-1">
      <section class="section">
        <div class="container">
          <!-- <router-view :key="$route.fullPath" /> -->
          <Nuxt />
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import isShareMode from '@/utils/isShareMode'

@Component<Dashboard>({})
export default class Dashboard extends Vue {
  get isNavbarVisible() {
    return !isShareMode
  }
}
</script>
