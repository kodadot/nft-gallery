<template>
  <div></div>
</template>

<script setup lang="ts">
const { $seoMeta } = useNuxtApp()
const props = withDefaults(
  defineProps<{
    title: string
    mime: string
    description?: string
    url: string
    image?: string
    video?: string
  }>(),
  {
    title: '',
    mime: '',
    description: '',
    url: '',
    image: '',
    video: '',
  }
)

useNuxt2Meta({
  title: props.title,
  meta: [
    ...$seoMeta({
      mime: props.mime,
      tittle: props.title,
      description: props.description,
      url: props.url,
      image: props.image,
      video: props.video,
    }),
  ],
})
</script>
