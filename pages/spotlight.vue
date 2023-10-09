<template>
  <section>
    <StatsHeader
      :title="$t('spotlight.title')"
      :subtitle="$t('spotlight.subtitle')" />
    <SpotlightTable />
  </section>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'NFT artist rank',
  description: 'Discover new artists based on ranking',
  ogUrl: '/spotlight',
})
</script>
