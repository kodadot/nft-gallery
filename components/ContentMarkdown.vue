<template>
  <section class="content">
    <VueMarkdown :source="text()" :options="options" />
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import hljs from 'highlight.js'
import Contributing from '../CONTRIBUTING.md'
import FirstTime from '../FIRST_TIME.md'

const highlight = function (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value
    } catch (__) {
      return ''
    }
  }
  return ''
}

@Component({
  components: {
    VueMarkdown: () => import('vue-markdown-render'),
  },
  data() {
    return {
      options: {
        highlight,
      },
    }
  },
})
export default class Contribute extends Vue {
  @Prop(String) public type!: 'contribute' | 'first_time'

  text() {
    if (this.type === 'contribute') {
      return Contributing
    }

    return FirstTime
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
