<template>
  <div id="Error" class="container has-text-centered">
    <h1 class="title">{{ error.statusCode }} - {{ headline }}</h1>
    <p class="subtitle">{{ error.message || 'Something went wrong' }}</p>
    <p v-if="error.path" class="subtitle">Path: {{ error.path }}</p>
    <img
      :src="`https://http.cat/${error.statusCode}`"
      alt="Internal error cat"
      class="mb-5" />
    <p class="subtitle">
      If you think this should't happen, report it to us by
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title="
        >creating a bug issue with steps and screenshot to reproduce.</a
      >
    </p>
    <NeoButton tag="nuxt-link" :to="`/${urlPrefix}/explore/collectibles`">
      Explore NFTs and Collections
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const props = defineProps({
  error: Object,
})
const { urlPrefix } = usePrefix()
const headline = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page not found'
    case 410:
      return 'Page gone'
    case 500:
      return 'Internal Server Error'
    default:
      return 'Indexer Error'
  }
})
</script>
