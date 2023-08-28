<template>
  <Teleport />
</template>

<script lang="ts">
import Teleport from '@/components/teleport/Teleport.vue'

export default {
  name: 'TeleportPage',
  components: {
    Teleport,
  },
  head() {
    const title = 'Teleport'
    const metaData = {
      title,
      description: 'Teleport your assets between chains',
      url: '/teleport',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
