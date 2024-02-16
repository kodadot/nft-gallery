<template>
  <div>
    <div class="title is-2">{{ $t('general.featuredArticlesHeading') }}</div>

    <div class="flex flex-col md:flex-row gap-3 mb-5">
      <div
        v-for="article in articles.slice(0, 4)"
        :key="article.id"
        class="flex-1 last:hidden 2xl:last:visible">
        <CardArticle
          :link="article.web_url"
          :image="article.thumbnail_url"
          :title="article.title" />
      </div>
    </div>

    <a
      href="https://kodadotweeklyroundup.beehiiv.com/"
      class="link"
      target="_blank"
      rel="nofollow noopener noreferrer">
      {{ $t('helper.seeMore') }} >
    </a>
  </div>
</template>

<script lang="ts" setup>
import { CardArticle } from '@kodadot1/brick'
import posts from '@/script/posts.json'

interface Articles {
  id: string
  title: string
  subtitle: string
  thumbnail_url: string
  web_url: string
}

const articles: Articles[] = posts
</script>
