<template>
  <Massmint />
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { usePreferencesStore } from '@/stores/preferences'
import Massmint from '@/components/massmint/Massmint.vue'
const components = { Massmint }

@Component<MassmintPage>({
  components,
})
export default class MassmintPage extends Vue {
  head() {
    const title = 'Low minting fees and carbonless NFTs'
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
  }
  layout() {
    return 'noFooter'
  }
  middleware({ store, redirect }) {
    const prefix = store.getters.currentUrlPrefix

    if (!usePreferencesStore().getVisitedOnboarding) {
      setTimeout(() => redirect(`/${prefix}/massmint/onboarding`))
    }
  }
}
</script>
