<template>
  <Landing prefix="statemine" buildOn="Statemine Unique Pallet" />
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
    if (prefix !== 'statemine') {
      console.log('Not statemine');
      store.dispatch('setUrlPrefix', 'statemine');
    }
  }
}
</script>
