<template>
  <Drops />
</template>

<script lang="ts">
import Drops from '@/components/drops/Drops.vue'

export default {
  name: 'DropsDetail',
  components: {
    Drops,
  },
  head() {
    const title = 'Drops'
    const metaData = {
      title,
      description: 'View all drops',
      url: '/drops',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
