<template>
  <section>
    <StatsHeader
      :title="$t('hot.title')"
      :subtitle="$t('hot.subtitle', { chain: urlPrefix })" />
    <HotTable />
  </section>
</template>
<script lang="ts">
export default {
  name: 'HotDashboard',
  setup() {
    const { urlPrefix } = usePrefix()

    return {
      urlPrefix,
    }
  },
  head() {
    const title = 'Recently KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the hot NFTs on Kusama',
      url: '/hot',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
