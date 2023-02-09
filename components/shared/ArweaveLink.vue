<template>
  <ExternalLink :id="id" :url="link" class="is-flex">
    <figure class="image is-24x24 icon__less-margin">
      <img src="/arweave.svg" />
    </figure>
    <b class="is-align-self-center">View {{ label }} on Arweave</b>
  </ExternalLink>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    id: string
    label: string
  }>(),
  {
    id: '',
    label: 'content',
  }
)
const link = 'https://viewblock.io/arweave/tx/'
</script>

<style scoped>
.icon__less-margin {
  margin: 0 0.5rem 1em 0 !important;
}
</style>
