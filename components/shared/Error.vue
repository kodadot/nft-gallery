<template>
  <div id="Error" class="container has-text-centered section">
    <p class="title">{{ errorTitle }}</p>
    <p class="subtitle">{{ errorSubtitle }}</p>
    <img v-if="hasImg" :src="imgSrc" alt="Internal error cat" />
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
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class Error extends Vue {
  @Prop({ default: 500 }) readonly errorCode!: number
  @Prop({ default: true }) readonly hasImg!: boolean
  @Prop({ default: 'Indexer Error' }) errorTitle!: string
  @Prop({ default: 'Indexer is not working properly.' }) errorSubtitle!: string

  get imgSrc() {
    return `https://http.cat/${this.$props.errorCode}`
  }
}
</script>
