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

interface Articles {
  title: string
  description: string
  image: string
  link: string
}

const articles: Articles[] = [
  {
    title: 'A few words about DOTBrno and ETHBrno',
    // prettier-ignore
    description:
      'This year has come together in Brno (Czech Republic) two big events from two significant ecosystems just for one November week. And since it\'s my birth town, let me introduce you to both events.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F35112f48-b33c-4b59-a96c-0feb41fdbdb7_1200x675.png',
    link: 'https://kodadot.substack.com/p/a-few-words-about-dotbrno-and-ethbrno',
  },
  {
    title: 'RIDE ON ART #4 Keith',
    description:
      // prettier-ignore
      'Hello, my name is Luuu and I’m glad that I can introduce you to another talented artist we did an interview with. Sit back, relax and learn more about Keith\'s life and art.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F1170d884-3ed4-4915-ba45-0e237872b34c_2400x1350.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-4-keith',
  },
  {
    // prettier-ignore
    title: 'RIDE ON ART #2 - HookerNFT',
    description:
      // prettier-ignore
      'My name is Luuu and I’m bringing you another interview with the talented artist. In KodaDot, we love good art, especially with interesting stories. Find out more about our newest cooperation.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fb2442781-e7d6-4ed2-b444-e55036a989ef_1200x675.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-2-hookernft',
  },
]
</script>
