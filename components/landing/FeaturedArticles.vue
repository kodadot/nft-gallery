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
    title: 'RIDE ON ART #7 - CHIGO ARTISH',
    description:
      // prettier-ignore
      'You probably noticed that a few weeks ago, a new collection, Coalesce, was minted on KodaDot. Each piece is a collage full of bright colours. You will fall in love with them as it happened to me.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd31d2945-c620-423a-8c21-d88807326b45_1200x675.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-7-chigo-artish',
  },
  {
    // prettier-ignore
    title: 'How was DOTBrno? 💚',
    description:
      // prettier-ignore
      'After a successful event, DotsamaPrague, we decided to organise DOTBrno. Read more about how this day went, who the speakers were and what surprises we prepared for attendees.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F2399b7cb-c35e-4e2a-97ff-2c8da99929bc_1456x485.png',
    link: 'https://kodadot.substack.com/p/how-was-dotbrno',
  },
]
</script>
