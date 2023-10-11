<template>
  <div class="container is-fluid">
    <CollectionGridWithBreadcrumbs />
  </div>
</template>

<script lang="ts" setup>
import { explorerVisible } from '@/utils/config/permission.config'

const { urlPrefix } = usePrefix()

const checkRouteAvailability = () => {
  if (!explorerVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => checkRouteAvailability())

definePageMeta({
  layout: 'explore-layout',
})

useSeoMeta({
  title: 'Explore NFTs',
  description: 'Buy Carbonless NFTs on KodaDot',
  ogUrl: `/${urlPrefix.value}/explore/items`,
})
</script>
