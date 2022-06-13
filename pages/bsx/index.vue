<template>
  <Landing prefix="bsx" buildOn="Basilisk" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    Landing: () => import('@/components/landing/Landing.vue'),
  },
})
export default class LandingPage extends Vue {
  layout() {
    return 'full-width-layout'
  }

  middleware({ store }) {
    // If the user is not authenticated
    const prefix = store.getters.currentUrlPrefix
    if (prefix !== 'bsx') {
      this.$consola.log('Not BSX')
      store.dispatch('setUrlPrefix', 'bsx')
    }
  }
}
</script>
