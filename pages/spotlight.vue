<template>
  <section>
    <StatsHeader
      :title="$t('spotlight.title')"
      :subtitle="$t('spotlight.subtitle')" />
    <SpotlightTable />
  </section>
</template>

<script lang="ts">
export default {
  name: 'Spotlight',
  components: {
    SpotlightTable: () => import('@/components/spotlight/SpotlightTable.vue'),
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/spotlight',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
