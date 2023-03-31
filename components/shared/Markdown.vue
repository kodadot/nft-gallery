<template>
  <vue-markdown
    :source="source"
    class="content-markdown"
    :anchor-attributes="{
      target: '_blank',
      rel: 'noopener noreferrer',
    }"
    @rendered="update" />
</template>

<script lang="ts" setup>
import VueMarkdown from 'vue-markdown-v2'
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css' // theme

import '@/styles/components/_content-markdown.scss'

// import languages
import 'prismjs/components/prism-javascript.min'
import 'prismjs/components/prism-json.min'
import 'prismjs/components/prism-graphql.min'
import 'prismjs/components/prism-typescript.min'
import 'prismjs/components/prism-bash.min'

defineProps<{
  source: string
}>()

const { $nextTick } = useNuxtApp()

const update = () => {
  $nextTick(() => {
    Prism.highlightAll()
  })
}
</script>
