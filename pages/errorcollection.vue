<template>
  <div class="box container has-text-centered" id="Eror">
    <p class="title">Oops! Collection Not Found</p>
    <p class="subtitle mt-4">
      If you think this should't happen, report us by
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title="
        >creating bug issue with steps to reproduce and screenshot.</a
      >
    </p>
    <b-button
      tag="nuxt-link"
      :to="`/${urlPrefix}/explore`"
      type="is-primary"
      class="my-5">
      Go to collections
    </b-button>
  </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({})
export default class ErrorCollection extends mixins(PrefixMixin) {}
</script>
