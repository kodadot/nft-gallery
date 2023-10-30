<template>
  <div class="content-markdown" v-html="markdown.render(source)" />
</template>

<script lang="ts" setup>
// import { useRedirectModal } from '@/components/redirect/useRedirectModal'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  highlight: (code: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          hljs.highlight(code, { language: lang } as any).value +
          '</code></pre>'
        )
      } catch (__) {
        return ''
      }
    }
    return hljs.highlightAuto(code).value
  },
})

defineProps<{
  source: string
}>()

// useRedirectModal(markdown)
</script>
