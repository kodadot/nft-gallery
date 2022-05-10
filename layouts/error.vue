<template>
  <div id="Error" class="box container has-text-centered">
    <h1 class="title">{{ error.statusCode }} - {{ headline }}</h1>
    <p class="subtitle">{{ error.message || 'Something went wrong' }}</p>
    <p v-if="error.path" class="subtitle">Path: {{ error.path }}</p>
    <!-- <p class="subtitle">Indexer is not working properly.</p> -->
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
    <b-button
      tag="nuxt-link"
      :to="`/${urlPrefix}/explore`"
      type="is-primary"
      class="mt-5">
      Explore NFTs and Collections
    </b-button>
  </div>
</template>
<script lang="ts">
import { NuxtError } from '@nuxt/types'
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({})
export default class Error extends mixins(PrefixMixin) {
  @Prop({ type: Object, required: true }) readonly error!: NuxtError

  get headline(): string {
    switch (this.error?.statusCode) {
      case 404:
        return 'Page not found'
      case 410:
        return 'Page gone'
      case 500:
        return 'Internal Server Error'
      default:
        return 'Indexer Error'
    }
  }
}
</script>
