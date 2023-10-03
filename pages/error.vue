<template>
  <ErrorMsg />
</template>
<script lang="ts">
import ErrorMsg from '@/components/shared/Error.vue'

export default {
  name: 'ErrorPage',
  components: {
    ErrorMsg,
  },
  head() {
    const title = 'Error'
    const metaData = {
      title,
      description:
        'Oops! Something went wrong. We apologize for the inconvenience. Our team is already working on fixing the issue. In the meantime, you may return to the homepage or try again later.',
      url: '/error',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
