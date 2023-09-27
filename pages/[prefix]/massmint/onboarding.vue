<template>
  <div class="py-8">
    <OnBoarding />
  </div>
</template>

<script lang="ts">
import OnBoarding from '@/components/massmint/OnBoarding.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { massmintCreateVisible } from '@/utils/config/permission.config'

definePageMeta({
  layout: 'full-width-layout',
})

export default {
  name: 'MassmintOnboardingPage',
  components: {
    OnBoarding,
  },
  middleware({ redirect, params }) {
    if (usePreferencesStore().getVisitedOnboarding) {
      redirect(`/${params.prefix}/massmint`)
    }

    if (!massmintCreateVisible(params.prefix)) {
      setTimeout(() => redirect('/'))
    }
  },
  setup() {
    useHead({
      title: 'Massmint - Onboarding',
      meta: [
        {
          name: 'description',
          content:
            'onboarding and tutorial for minting multiple NFTs at once on KodaDot',
        },
      ],
    })
  },
}
</script>
