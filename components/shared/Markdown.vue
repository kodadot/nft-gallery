<template>
  <div v-dompurify-html="markdown.render(source)" class="content-markdown" />
</template>

<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

const props = withDefaults(
  defineProps<{
    source: string
    html?: boolean
  }>(),
  { html: false },
)

const markdown = new MarkdownIt({
  breaks: true,
  html: props.html,
  highlight: (code: string, lang: string) => {
    if (lang && Prism.languages[lang]) {
      return `<pre class="language-${lang}"><code>${Prism.highlight(
        code,
        Prism.languages[lang],
        lang,
      )}</code></pre>`
    }

    return `<pre class="language-none"><code>${markdown.utils.escapeHtml(
      code,
    )}</code></pre>`
  },
})

// useRedirectModal(markdown)
</script>
