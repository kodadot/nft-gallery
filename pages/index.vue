<template>
  <LandingPage />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'

@Component({
  name: 'HomePage',
  components: {
    LandingPage: () => import('@/components/landing/LandingPage.vue'),
  },
})
export default class HomePage extends mixins(PrefixMixin) {
  layout() {
    return 'full-width-layout'
  }
}
</script>
