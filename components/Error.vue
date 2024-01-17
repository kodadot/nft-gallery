<template>
  <div id="Error" class="container text-center section">
    <h1 class="title">{{ errorTitle }}</h1>
    <p class="subtitle">{{ errorSubtitle }}</p>
    <img v-if="hasImg" :src="imgSrc" alt="Internal error cat" />
    <p class="subtitle">
      If you think this should't happen, report us by
      <a
        target="_blank"
        rel="nofollow noopener noreferrer"
        href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title="
        >creating bug issue with steps to reproduce and screenshot.</a
      >
    </p>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    errorCode: number
    hasImg: boolean
    errorTitle: string
    errorSubtitle: string
  }>(),
  {
    errorCode: 500,
    hasImg: true,
    errorTitle: 'Indexer Error',
    errorSubtitle: 'Indexer is not working properly.',
  },
)

const imgSrc = computed(() => `https://http.cat/${props.errorCode}`)
</script>
