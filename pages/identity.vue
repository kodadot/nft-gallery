<template>
  <Identity />
</template>

<script lang="ts">
import Identity from '@/components/common/IdentityForm.vue'

export default {
  name: 'IdentityPage',
  components: {
    Identity,
  },
  layout: 'centered-half-layout',
  head() {
    const title = 'Identity'
    const metaData = {
      title,
      description: 'Create your on-chain identity',
      url: '/identity',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
