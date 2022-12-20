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
    title: 'Travel with KodaDot to Lisbon and Budapest',
    // prettier-ignore
    description:
      'The Christmas holiday is nearly here but before the well-deserved rest, we co-organize two events. Let me introduce them to you...',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fa5f550d2-1863-4a0a-8815-18e29c0c9858_1456x728.webp',
    link: 'https://kodadot.substack.com/p/travel-with-kodadot-to-lisbon-and',
  },
  {
    title: 'RIDE ON ART #6 RainbowNFT',
    description:
      // prettier-ignore
      'Another Friday, another article. This week I will introduce you to RainbowNFT. An incredible NFT artist who is part of our DotSama ecosystem. Who is the person behind this art? Read and learn!',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fefd65f3d-b736-4b29-81c8-c65fa000d952_1200x675.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-6-rainbownft',
  },
  {
    // prettier-ignore
    title: 'RIDE ON ART #5 KUSAMA ACID',
    description:
      // prettier-ignore
      'Hello Koda readers. I\'m happy to introduce you to our already fifth artist in this series, "Ride on art". Adding music to NFTs is just a whole different level and area, don\'t you think?\n',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F4a146af3-aa81-41cd-924d-5bfe43da0931_1200x675.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-5-kusama-acid',
  },
]
</script>
