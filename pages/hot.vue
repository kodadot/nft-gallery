<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('sales.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('sales.subtitle') }}</p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="rmrk-logo is-hidden-mobile" />
      </div>
    </div>
    <HotTable />
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component<HotDashboard>({
  head() {
    const title = 'Recently KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the hot NFTs on RMRK.',
      url: './hot.vue',
      image: `${this.$config.baseUrl}/k_card_series.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class HotDashboard extends Vue {}
</script>

<style scoped lang="scss">
.rmrk-logo {
  aspect-ratio: 127 / 42;
}
</style>
