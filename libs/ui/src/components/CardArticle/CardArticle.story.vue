<template>
  <Story>
    <Variant title="Light Mode">
      <CardArticle
        :description="description"
        :href="href"
        :image="image"
        :title="title" />
    </Variant>

    <Variant title="Dark Mode">
      <div class="dark-mode">
        <CardArticle
          :description="description"
          :href="href"
          :image="image"
          :title="title" />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import CardArticle from './CardArticle.vue'

const description =
  'We want to tell you the whole story about how the idea for this design was born, how the entire process went, and finally, how the t-shirts got to you.'
const href = 'https://kodadot.substack.com/p/the-story-behind-our-t-shirt-waifu'
const image =
  'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F17ba0b12-64b6-4fe0-a0a9-38d722e51755_2848x3340.jpeg'
const title = 'The story behind our t-shirt waifu design'
</script>
