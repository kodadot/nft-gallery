<template>
  <section class="content">
    <VueMarkdown :source="content" :options="options" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import highlight from '~/utils/highlight'

import '@/styles/components/_content-markdown.scss'

import FirstTimeMD from '../../../FIRST_TIME.md'

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
export default class FirstTime extends Vue {
  get content() {
    return FirstTimeMD
  }
}
</script>
