<template>
  <section>
    <StatsHeader :title="$t('hot.title')" :subtitle="$t('hot.subtitle')" />
    <HotTable />
  </section>
</template>
<script lang="ts">
export default {
  name: 'HotDashboard',

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
}
</script>
