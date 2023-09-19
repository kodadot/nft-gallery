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

    useHead({
      title: 'Recently KUSAMA Sales',
      meta: [
        {
          name: 'description',
          content: 'Featuring the hot NFTs on Kusama',
        },
      ],
    })

    return {
      urlPrefix,
    }
  },
}
</script>
