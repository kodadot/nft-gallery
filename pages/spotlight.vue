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
  setup() {
    useHead({
      title: 'NFT artist rank',
      meta: [
        {
          name: 'description',
          content: 'Discover new artists based on ranking',
        },
      ],
    })
  },
}
</script>
