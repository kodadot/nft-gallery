<template>
  <Story>
    <CardArticle
      :description="description"
      :href="href"
      :image="image"
      :title="title" />
  </Story>
</template>

<script lang="ts" setup>
import CardArticle from './CardArticle.vue'

const description =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam soluta explicabo reprehenderit? Vero fugit officiis enim temporibus nihil, quibusdam ea?'
const href = 'https://kodadot.substack.com/p/the-story-behind-our-t-shirt-waifu'
const image =
  'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F17ba0b12-64b6-4fe0-a0a9-38d722e51755_2848x3340.jpeg'
const title =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, dolore!'
</script>
