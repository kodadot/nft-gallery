<template>
  <ExploreLayoutWithSidebar>
    <Items :key="collectionid" />
  </ExploreLayoutWithSidebar>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'explore-layout',
})

const route = useRoute()

const collectionid = (route.params?.id ?? '') as string
</script>
