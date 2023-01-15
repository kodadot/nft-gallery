<template>
  <section>
    <StatsHeader :title="$t('hot.title')" :subtitle="$t('hot.subtitle')" />
    <HotTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<HotDashboard>({
  head() {
    const title = 'Recently KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the hot NFTs on RMRK.',
      url: '/hot.vue',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class HotDashboard extends Vue {}
</script>
