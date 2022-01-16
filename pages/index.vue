<template>
  <Landing prefix="rmrk" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'LandingPage',
  components: {
    Landing: () => import('@/components/landing/Landing.vue'),
  },
})
export default class LandingPage extends Vue {
  layout() {
    return 'full-width-layout';
  }
}
</script>
