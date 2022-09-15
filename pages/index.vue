<template>
  <div>
    <LandingPage v-if="redesign" />
    <LandingPageOld v-else :prefix="urlPrefix" :build-on="buildOnText" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import { prefixBuildOnText } from '@/utils/prefix'

@Component({
  name: 'HomePage',
  components: {
    LandingPage: () => import('@/components/landing/LandingPage.vue'),
    LandingPageOld: () => import('@/components/landing/LandingPageOld.vue'),
  },
})
export default class HomePage extends mixins(PrefixMixin, ExperimentMixin) {
  get buildOnText() {
    return prefixBuildOnText(this.urlPrefix)
  }

  layout() {
    return 'full-width-layout'
  }
}
</script>
