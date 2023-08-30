<template>
  <div class="py-8">
    <OnBoarding />
  </div>
</template>

<script lang="ts">
import OnBoarding from '@/components/massmint/OnBoarding.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { massmintCreateVisible } from '@/utils/config/permission.config'

export default {
  name: 'MassmintOnboardingPage',
  components: {
    OnBoarding,
  },
  layout() {
    return 'full-width-layout'
  },
  middleware({ redirect, params }) {
    if (usePreferencesStore().getVisitedOnboarding) {
      redirect(`/${params.prefix}/massmint`)
    }

    if (!massmintCreateVisible(params.prefix)) {
      setTimeout(() => redirect('/'))
    }
  },
  head() {
    const title = 'Massmint - Onboarding'
    const metaData = {
      title,
      type: 'profile',
      description:
        'onboarding and tutorial for minting multiple NFTs at once on KodaDot',
      url: `/${this.$route.params.prefix}/massmint/onboarding`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
