<template>
  <section class="content">
    <div v-html="text()" />
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Contributing from '../CONTRIBUTING.md'
import FirstTime from '../FIRST_TIME.md'

@Component({})
export default class Contribute extends Vue {
  @Prop(String) public type!: 'contribute' | 'first_time'

  text() {
    if (this.type === 'first_time') {
      return FirstTime
    }

    return Contributing
  }
}
</script>

<style lang="scss">
@import '~/node_modules/highlight.js/styles/github-dark.css';

.content {
  pre,
  blockquote {
    background-color: black;
    border-left: 5px solid #dbdbdb;
    padding: 1.25em 1.5em;
  }
}
</style>
