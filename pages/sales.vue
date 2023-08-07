<template>
  <section>
    <StatsHeader
      :title="$t('sales.title')"
      :subtitle="$t('sales.subtitle', { chain: urlPrefix })" />

    <SalesTable />
  </section>
</template>
<script lang="ts">
export default {
  name: 'Sales',
  setup() {
    const { urlPrefix } = usePrefix()

    return {
      urlPrefix,
    }
  },
  head() {
    const title = 'Latest KUSAMA Sales'
    const metaData = {
      title,
      type: 'profile',
      description: 'Featuring the most recently sold NFTs on Kusama',
      url: '/sales',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
