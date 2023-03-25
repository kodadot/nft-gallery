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
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css' // theme
import 'prismjs/components/prism-javascript.min' // js language
import 'prismjs/components/prism-json.min' // json language
import '@/styles/components/_content-markdown.scss'

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
