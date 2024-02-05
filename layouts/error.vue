<template>
  <div id="Error" class="container text-center">
    <h1 class="title">{{ error.statusCode }} - {{ headline }}</h1>
    <p class="subtitle">{{ error.message || 'Something went wrong' }}</p>
    <p v-if="error.path" class="subtitle">Path: {{ error.path }}</p>
    <img
      :src="`https://http.cat/${error.statusCode}`"
      alt="Internal error cat"
      class="mb-5" />
    <p class="subtitle">
      If you think this shouldn't happen, report it to us by
      <a
        target="_blank"
        class="is-underlined text-k-orange"
        rel="nofollow noopener noreferrer"
        href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title="
        >creating a bug issue with steps and screenshot to reproduce.</a
      >
    </p>
    <nuxt-link
      :to="`/${urlPrefix}/explore/collectibles`"
      class="text-k-blue hover:text-k-blue-hover">
      Explore NFTs and Collections
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '@nuxt/types'

const props = defineProps<{
  error: NuxtError
}>()
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
