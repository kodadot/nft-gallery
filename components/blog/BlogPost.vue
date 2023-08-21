<template>
  <div class="article">
    <div
      class="is-flex is-justify-content-space-between has-text-grey is-size-5">
      <div>{{ attributes.tags }}</div>
      <div v-if="attributes.date">
        {{ format(new Date(attributes.date), 'dd.MM.yyyy') }}
      </div>
    </div>
    <h1>{{ attributes.title }}</h1>
    <p v-if="attributes.subtitle" class="subtitle">{{ attributes.subtitle }}</p>
    <img
      v-if="attributes.image"
      :src="attributes.image"
      :alt="attributes.title"
      width="100%" />
    <component :is="singlePostComponent" />
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { convertMarkdownToText } from '@/utils/markdown'
import { nextTick } from 'vue'
import hljs from 'highlight.js'

const { $seoMeta } = useNuxtApp()
const route = useRoute()

const slug = route.params.slug
const attributes = ref({})
const singlePostComponent = ref('')

onMounted(async () => {
  const post = await import(`~/content/blog/${slug}.md`)

  attributes.value = post.attributes
  singlePostComponent.value = post.vue.component

  // must wait the page finished render then highlight the code
  await nextTick()
  hljs.highlightAll()
})

const title = computed(() => attributes.value.title)
const meta = computed(() => {
  return [
    ...$seoMeta({
      title: attributes.value.title,
      description: convertMarkdownToText(attributes.value.subtitle),
      url: route.path,
      image: attributes.value.image,
    }),
  ]
})

useNuxt2Meta({
  title,
  meta,
})
</script>

<style lang="scss">
@use 'sass:meta';
@import '@/styles/abstracts/variables';

// dynamic load highlight syntax theme based on page theme
html.light-mode {
  @include meta.load-css('highlight.js/styles/atom-one-light');
}
html.dark-mode {
  @include meta.load-css('highlight.js/styles/atom-one-dark');
  .article p > code {
    // color from them atom-one-dark theme
    color: #abb2bf;
    background: #282c34;
  }
}
.article {
  margin: 0 auto;
  max-width: 40rem;

  .subtitle {
    font-size: 25px;
    margin-bottom: 0;
    white-space: break-spaces;
  }

  .markdown-body {
    h1:nth-child(n + 2),
    h2:nth-child(n + 2),
    h3:nth-child(n + 2),
    h4:nth-child(n + 2) {
      margin-top: 2.5rem;
    }
  }

  h1,
  h2,
  h3,
  h4,
  p {
    margin: 0.75rem 0;
  }

  h1 {
    font-size: 3rem;
    line-height: 3.5rem;
    font-weight: 700;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: bold;
  }

  h4 {
    font-size: 1rem;
    font-weight: bold;
  }

  img {
    border-radius: 1rem;
    margin: 2.5rem 0;
  }

  p {
    font-size: 20px;
    line-height: 30px;
  }

  @include ktheme() {
    .markdown-body {
      color: theme('k-accentlight2-dark');
    }

    h2 {
      color: theme('k-accentlight2-dark-head');
    }

    p {
      color: theme('k-accentlight2-dark-paragraph');
    }

    img {
      border: 1px solid theme('border-color');
    }

    a {
      color: theme('k-blue');
    }

    pre {
      padding-left: 0;
      padding-right: 0;
      font-size: 1rem;
      background-color: theme('background-color');
    }
  }

  @include touch {
    .subtitle {
      font-size: 1.25rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    h2,
    p {
      font-size: 1rem;
    }

    h3 {
      font-size: 0.9rem;
    }
    h4 {
      font-size: 0.8rem;
    }
  }
}
</style>
