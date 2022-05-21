<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('collector.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('collector.subtitle') }}</p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="rmrk-logo is-hidden-mobile" />
      </div>
    </div>

    <CollectorTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<CollectorWhale>({
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    CollectorTable: () => import('@/components/collector/CollectorTable.vue'),
  },
  head() {
    const title = 'NFT Collector rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new collectors based on ranking',
      url: '/spotlight',
      image: `${this.$config.baseUrl}/k_card_spotlight.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class CollectorWhale extends Vue {}
</script>

<style scoped lang="scss">
.rmrk-logo {
  aspect-ratio: 127 / 42;
}
</style>
