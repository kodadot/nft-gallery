<template>
  <div class="py-6">
    <OnBoarding />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OnBoarding from '@/components/massmint/OnBoarding.vue'
import { useMassmintsStore } from '@/stores/massmint'

const components = { OnBoarding }

@Component<OnBoardingPage>({
  components,
  layout() {
    return 'full-width-layout'
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
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

    const { visitedOnboarding } = useMassmintsStore().getVisitedOnboarding
    if (visitedOnboarding) {
      setTimeout(() => redirect(`/${prefix}/massmint`))
    }
  },
})
export default class OnBoardingPage extends Vue {}
</script>
