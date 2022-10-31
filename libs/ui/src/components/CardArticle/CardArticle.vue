<template>
  <a class="article" :href="href" target="_blank" rel="noopener noreferrer">
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
  href: string
  image: string
  title: string
  description: string
}>()
</script>

<style lang="scss" scoped>
@import './CardArticle.scss';
</style>
