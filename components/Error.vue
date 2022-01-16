<template>
  <div id="Eror" class="box container has-text-centered">
    <p class="title">Indexer Error</p>
    <p class="subtitle">Indexer is not working properly.</p>
    <img src="https://http.cat/500" alt="Internal error cat" />
    <p class="subtitle">
      If you think this should't happen, report us by
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title="
        >creating bug issue with steps to reproduce and screenshot.</a
      >
    </p>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class FourZeroFour extends Vue {}
</script>
