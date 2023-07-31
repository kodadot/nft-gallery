<template>
  <Massmint />
</template>
<script lang="ts">
import { usePreferencesStore } from '@/stores/preferences'

export default {
  name: 'MassmintPage',

  layout() {
    return 'noFooter'
  },
  middleware({ redirect, params }) {
    if (!usePreferencesStore().getVisitedOnboarding) {
      setTimeout(() => redirect(`/${params.prefix}/massmint/onboarding`))
    }
  },

  head() {
    const title = 'Kodadot | Massmint'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
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
