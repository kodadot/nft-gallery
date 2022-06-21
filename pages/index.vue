<template>
  <Landing :prefix="urlPrefix" :buildOn="prefixBuildOnText" />
</template>

<script lang="ts">
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'

@Component({
  name: 'LandingPage',
  components: {
    Landing: () => import('@/components/landing/Landing.vue'),
  },
})
export default class LandingPage extends mixins(PrefixMixin) {
  layout() {
    return 'full-width-layout'
  }
}
</script>
