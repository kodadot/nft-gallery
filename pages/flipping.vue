<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('flipping.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('flipping.subtitle') }}</p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="rmrk-logo is-hidden-mobile" />
      </div>
    </div>

    <FlippingTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Flipping>({
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    FlippingTable: () => import('@/components/flips/FlippingTable.vue'),
  },
  head() {
    const title = 'Most Flipping NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the most flipping NFTs on RMRK.',
      url: './flipping.vue',
      image: `${this.$config.baseUrl}/k_card_series.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Flipping extends Vue {}
</script>

<style scoped lang="scss">
.rmrk-logo {
  aspect-ratio: 127 / 42;
}
</style>
