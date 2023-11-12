<template>
  <a
    v-safe-href="link"
    class="article"
    target="_blank"
    rel="nofollow noopener noreferrer">
    <NuxtImg
      class="article-image"
      :src="image"
      loading="lazy"
      format="webp"
      quality="85" />
    <div class="article-info">
      <p class="article-title">
        {{ title }}
      </p>
      <p class="is-size-7">
        {{ description }}
      </p>
    </div>
  </a>
</template>

<script lang="ts" setup>
defineProps<{
  link: string
  image: string
  title: string
  description: string
}>()
</script>

<style lang="scss" scoped>
@import './CardArticle.scss';
</style>
