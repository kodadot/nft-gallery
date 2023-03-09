<template>
  <Massmint />
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { useMassmintsStore } from '@/stores/massmint'
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
  middleware({ store, redirect }) {
    const prefix = store.getters.currentUrlPrefix

    const { visitedOnboarding } = useMassmintsStore().getVisitedOnboarding
    if (!visitedOnboarding) {
      setTimeout(() => redirect(`/${prefix}/massmint/onboarding`))
    }
  }
}
</script>
