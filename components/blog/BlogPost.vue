<template>
  <div v-if="post?.title" class="article">
    <div class="flex items-center text-k-grey is-size-5 mb-1">
      <nuxt-link class="text-k-grey" to="/blog">{{ $t('blog') }}</nuxt-link>
      <NeoIcon icon="chevron-right" class="mx-5" />
      <span>{{ post?.title?.slice(0, 15) }}...</span>
    </div>
    <h1>{{ post?.title }}</h1>
    <p v-if="post?.subtitle" class="subtitle">{{ post?.subtitle }}</p>

    <div class="flex justify-between items-center text-k-grey mt-5">
      <div
        v-if="post?.date"
        class="border border-k-shade rounded-[3rem] px-4 py-1">
        {{ format(new Date(post?.date), 'dd.MM.yyyy') }}
      </div>

      <div>
        <NeoButton
          icon="x-twitter"
          icon-pack="fab"
          no-shadow
          class="no-border is-text is-size-4 p-0 mr-4"
          @click="openShareUrl('twitter')" />

        <NeoButton
          icon="linkedin"
          icon-pack="fab"
          no-shadow
          class="no-border is-text is-size-4 p-0"
          @click="openShareUrl('linkedin')" />
      </div>
    </div>

    <img :src="post?.image" :alt="post?.title" class="mt-5" />

    <ContentDoc :path="post._path" />
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { convertMarkdownToText } from '@/utils/markdown'
import Prism from 'prismjs'
import { URLS } from '@/utils/constants'

const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData('post', () =>
  queryContent(`/blog/${slug}`).findOne(),
)

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

onMounted(() => {
  Prism.highlightAll()
})

const title = computed(() => post?.title)
useSeoMeta({
  title: title.value,
  description: convertMarkdownToText(post?.subtitle),
  ogUrl: route.path,
  ogImage: post?.image,
  twitterImage: post?.image,
})
</script>

<style lang="scss">
@use 'sass:meta';
@import '@/assets/styles/abstracts/variables';

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
    font-weight: 700;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
  }

  h4 {
    font-size: 1rem;
    font-weight: 700;
  }

  img {
    @apply mx-0 my-10 rounded-2xl;
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
