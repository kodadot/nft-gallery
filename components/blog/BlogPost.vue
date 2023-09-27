<template>
  <div v-if="attributes.title" class="article">
    <div class="is-flex is-align-items-center has-text-grey is-size-5 mb-1">
      <nuxt-link class="has-text-grey" to="/blog">{{ $t('blog') }}</nuxt-link>
      <NeoIcon icon="chevron-right" class="mx-5" />
      <span>{{ attributes.title?.slice(0, 15) }}...</span>
    </div>
    <h1>{{ attributes.title }}</h1>
    <p v-if="attributes.subtitle" class="subtitle">{{ attributes.subtitle }}</p>

    <div
      class="is-flex is-justify-content-space-between is-align-items-center has-text-grey mt-5">
      <div
        v-if="attributes.date"
        class="border border-k-shade fixed-border-radius px-4 py-1">
        {{ format(new Date(attributes.date), 'dd.MM.yyyy') }}
      </div>

      <div>
        <NeoButton
          icon="x-twitter"
          icon-pack="fab"
          no-shadow
          class="no-border is-text is-size-4 p-0 mr-4"
          @click.native="openShareUrl('twitter')" />

        <NeoButton
          icon="linkedin"
          icon-pack="fab"
          no-shadow
          class="no-border is-text is-size-4 p-0"
          @click.native="openShareUrl('linkedin')" />
      </div>
    </div>
    <img
      v-if="attributes.image"
      :src="attributes.image"
      :alt="attributes.title"
      class="mt-5"
      width="100%" />
    <component :is="singlePostComponent" />
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { convertMarkdownToText } from '@/utils/markdown'
import { nextTick } from 'vue'
import hljs from 'highlight.js'
import { URLS } from '@/utils/constants'
const { $seoMeta } = useNuxtApp()
const route = useRoute()

const slug = route.params.slug
const attributes = ref<{
  image?: string
  title?: string
  date?: string
  subtitle?: string
}>({})
const singlePostComponent = ref('')

const openShareUrl = (platform: 'twitter' | 'linkedin') => {
  let shareUrl = ''
  switch (platform) {
    case 'twitter':
      shareUrl = 'https://twitter.com/intent/tweet?text='
      break
    case 'linkedin':
      shareUrl = 'https://www.linkedin.com/shareArticle?mini=true&url='
      break
  }
  const currentUrl = `${URLS.koda.baseUrl}${location.pathname}`

  window.open(`${shareUrl}${encodeURIComponent(currentUrl)}`, '_blank')
}

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

  .fixed-border-radius {
    border-radius: 3rem;
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

  p,
  li {
    font-size: 20px;
    line-height: 30px;
  }

  li {
    margin: 0 1.5rem;
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
    p,
    li {
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
