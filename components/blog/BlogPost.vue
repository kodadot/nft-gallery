<template>
  <div
    v-if="post?.title"
    class="article"
  >
    <div class="flex items-center text-k-grey text-xl mb-1">
      <nuxt-link
        class="text-k-grey"
        to="/blog"
      >
        {{ $t('blog') }}
      </nuxt-link>
      <NeoIcon
        icon="chevron-right"
        class="mx-5"
      />
      <span>{{ post?.title?.slice(0, 15) }}...</span>
    </div>
    <h1>{{ post?.title }}</h1>
    <p
      v-if="post?.subtitle"
      class="subtitle"
    >
      {{ post?.subtitle }}
    </p>

    <div class="flex justify-between items-center text-k-grey mt-5">
      <div
        v-if="post?.date"
        class="border border-k-shade rounded-[3rem] px-4 py-1"
      >
        {{ format(new Date(post?.date), 'dd.MM.yyyy') }}
      </div>

      <div>
        <NeoButton
          icon="x-twitter"
          icon-pack="fab"
          no-shadow
          class="border-0 is-text text-2xl p-0 mr-4"
          @click="openShareUrl('twitter')"
        />

        <NeoButton
          icon="linkedin"
          icon-pack="fab"
          no-shadow
          class="border-0 is-text text-2xl p-0"
          @click="openShareUrl('linkedin')"
        />
      </div>
    </div>

    <img
      :src="post?.image"
      :alt="post?.title"
      class="mt-5"
    >

    <ContentDoc :path="post._path" />
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import Prism from 'prismjs'
import { convertMarkdownToText } from '@/utils/markdown'
import { URLS } from '@/utils/constants'

const route = useRoute()
const slug = route.params.slug

const compatiblePostName = (originalName: string) => {
  return originalName.replaceAll('\'', '').replaceAll('%27', '').toLowerCase()
}

const { data: post } = await useAsyncData('post', () => {
  return queryContent(`/blog/${compatiblePostName(String(slug))}`).findOne()
})

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
