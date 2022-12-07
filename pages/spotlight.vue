<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('spotlight.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('spotlight.subtitle') }}</p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="chain-logo is-hidden-mobile" />
      </div>
    </div>

    <SpotlightTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Spotlight>({
  components: {
    Identity: () => import('@/components/identity/IdentityIndex.vue'),
    SpotlightTable: () => import('@/components/spotlight/SpotlightTable.vue'),
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/spotlight',
      image: `${this.$config.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Spotlight extends Vue {}
</script>
