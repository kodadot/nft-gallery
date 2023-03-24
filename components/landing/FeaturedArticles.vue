<template>
  <div>
    <div class="title is-2">{{ $t('general.featuredArticlesHeading') }}</div>

    <div class="columns">
      <div v-for="article in articles" :key="article.title" class="column">
        <CardArticle
          :href="article.link"
          :description="article.description"
          :image="article.image"
          :title="article.title" />
      </div>
    </div>

    <a
      href="https://kodadot.substack.com/"
      class="link"
      target="_blank"
      rel="noopener noreferrer">
      {{ $t('helper.seeMore') }} >
    </a>
  </div>
</template>

<script lang="ts" setup>
import { CardArticle } from '@kodadot1/brick'
import substack from '@/script/substack.json'

interface Articles {
  title: string
  description: string
  image: string
  link: string
}

const articles: Articles[] = substack.post
</script>

<style scoped>
@media screen and (max-width: 1540px) {
  .columns .column:last-child {
    display: none;
  }
}
</style>
