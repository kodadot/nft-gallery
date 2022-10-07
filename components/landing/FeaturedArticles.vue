<template>
  <div>
    <div class="title is-2">{{ $t('general.featuredArticlesHeading') }}</div>

    <div class="columns">
      <div v-for="article in articles" :key="article.title" class="column">
        <a
          class="article"
          :href="article.link"
          target="_blank"
          rel="noopener noreferrer">
          <div
            class="article-image"
            :style="{ 'background-image': `url(${article.image})` }"></div>
          <div class="article-info">
            <p class="article-title">
              {{ article.title }}
            </p>
            <p class="is-size-7">
              {{ article.description }}
            </p>
          </div>
        </a>
      </div>
    </div>

    <a href="https://kodadot.substack.com/" class="link" target="_blank">
      {{ $t('helper.seeMore') }} >
    </a>
  </div>
</template>

<script lang="ts" setup>
interface Articles {
  title: string
  description: string
  image: string
  link: string
}

const articles: Articles[] = [
  {
    title: 'The story behind our t-shirt waifu design',
    description:
      'We want to tell you the whole story about how the idea for this design was born, how the entire process went, and finally, how the t-shirts got to you.',
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F17ba0b12-64b6-4fe0-a0a9-38d722e51755_2848x3340.jpeg',
    link: 'https://kodadot.substack.com/p/the-story-behind-our-t-shirt-waifu',
  },
  {
    title: 'RIDE ON ART #1 - ZLUCHKAYAAA',
    description:
      "Hello everyone, my name is Claire, and I'm working in KodaDot as marketing and social media manager. I'll introduce you some of the most talented artists we have worked with.",
    image:
      'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F52d9f1cf-457b-4855-ba14-e662c607400c_1200x675.png',
    link: 'https://kodadot.substack.com/p/ride-on-art-1-zluchkayaaa',
  },
  {
    title: "THE ARTIST'S INSIGHT #1 - Clown World House",
    description:
      "Are you thinking about minting your completely first NFT collection? But you don't know how to start? I'll try to bring you some advice from people who do this for a living and have enough experience.",
    image:
      'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F6fe1fa7e-013f-4770-9b93-1bc84775ded2_1200x675.png',
    link: 'https://kodadot.substack.com/p/the-artists-inside-1-clown-world',
  },
]
</script>
