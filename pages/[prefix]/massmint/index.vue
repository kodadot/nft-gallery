<template>
  <Massmint />
</template>
<script lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
import { massmintCreateVisible } from '@/utils/config/permission.config'

export default {
  name: 'MassmintPage',

  layout() {
    return 'noFooter'
  },
  middleware({ redirect, params }) {
    if (!usePreferencesStore().getVisitedOnboarding) {
      setTimeout(() => redirect(`/${params.prefix}/massmint/onboarding`))
    }

    if (!massmintCreateVisible(params.prefix)) {
      setTimeout(() => redirect('/'))
    }
  },

  head() {
    const title = 'Massmint'
    const metaData = {
      title,
      type: 'profile',
      description: 'Mint multiple NFTs at once',
      url: `/${this.$route.params.prefix}/massmint`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
