<template>
  <Landing prefix="statemine" buildOn="Statemine Unique Pallet" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    Landing: () => import('@/components/landing/Landing.vue'),
  },
})
export default class LandingPage extends Vue {
  middleware({ store, route }) {
    const prefix = store.getters.currentUrlPrefix
    if (prefix !== route.name) {
      console.log('[EXPECT]', route.name, 'got', prefix)
      store.dispatch('setUrlPrefix', route.name)
    }
  }
}
</script>
