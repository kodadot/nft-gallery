<template>
  <Landing prefix="rmrk" buildOn="RMRK Protocol" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  components: {
    Landing: () => import('@/components/landing/Landing.vue'),
  },
})
export default class LandingPage extends Vue {
  middleware({ store }) {
    // If the user is not authenticated
    const prefix = store.getters.currentUrlPrefix;
    if (prefix !== 'rmrk') {
      console.log('Not RMRK');
      store.dispatch('setUrlPrefix', 'rmrk');
    }
  }
}
</script>
