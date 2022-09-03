<template>
  <Landing :prefix="urlPrefix" :build-on="buildOnText" />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { prefixBuildOnText } from '@/utils/prefix'

@Component({
  name: 'LandingPage',
  components: {
    Landing: () => import('@/components/landing/LandingPage.vue'),
  },
})
export default class LandingPage extends mixins(PrefixMixin) {
  get buildOnText() {
    return prefixBuildOnText(this.urlPrefix)
  }

  layout() {
    return 'full-width-layout'
  }
}
</script>
