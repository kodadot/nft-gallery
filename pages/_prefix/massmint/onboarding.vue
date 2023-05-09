<template>
  <div class="py-8">
    <OnBoarding />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OnBoarding from '@/components/massmint/OnBoarding.vue'
import { usePreferencesStore } from '@/stores/preferences'

const components = { OnBoarding }

@Component<OnBoardingPage>({
  components,
  layout() {
    return 'full-width-layout'
  },
  head() {
    const title = 'Kodadot | Massmint'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: `/${this.$route.params.prefix}/massmint/onboarding`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
  middleware({ store, redirect }) {
    const prefix = store.getters.currentUrlPrefix

    if (usePreferencesStore().getVisitedOnboarding) {
      setTimeout(() => redirect(`/${prefix}/massmint`))
    }
  },
})
export default class OnBoardingPage extends Vue {}
</script>
