<template>
  <div class="py-6">
    <OnBoarding />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import OnBoarding from '@/components/massmint/OnBoarding.vue'
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
})
export default class OnBoardingPage extends Vue {}
</script>
