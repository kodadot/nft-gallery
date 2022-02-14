<template>
  <Landing prefix="westend" buildOn="RMRK Protocol" />
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
    if (prefix !== 'westend') {
      console.log('Not westend')
      store.dispatch('setUrlPrefix', 'westend')
    }
  }
}
</script>
