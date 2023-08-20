<template>
  <a
    v-safe-href="link"
    class="article"
    target="_blank"
    rel="nofollow noopener noreferrer">
    <div
      class="article-image"
      :style="{ 'background-image': `url(${image})` }" />
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
