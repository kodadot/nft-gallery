<template>
  <div class="article">
    <div
      class="is-flex is-justify-content-space-between has-text-grey is-size-5">
      <div>{{ attributes.tags }}</div>
      <div v-if="attributes.date">
        {{ format(new Date(attributes.date), 'dd.MM.yyyy') }}
      </div>
    </div>
    <h1>{{ attributes.title }}</h1>
    <h2 v-if="attributes.subtitle">{{ attributes.subtitle }}</h2>
    <img
      v-if="attributes.image"
      :src="attributes.image"
      :alt="attributes.title"
      width="100%" />
    <component :is="singlePostComponent" />
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { convertMarkdownToText } from '@/utils/markdown'

const { $seoMeta } = useNuxtApp()
const route = useRoute()

const slug = route.params.slug
const attributes = ref({})
const singlePostComponent = ref('')

onMounted(async () => {
  const post = await import(`~/content/blog/${slug}.md`)

  attributes.value = post.attributes
  singlePostComponent.value = post.vue.component
})

const title = computed(() => attributes.value.title)
const meta = computed(() => {
  return [
    ...$seoMeta({
      title: attributes.value.title,
      description: convertMarkdownToText(attributes.value.subtitle),
      url: route.path,
      image: attributes.value.image,
    }),
  ]
})

useNuxt2Meta({
  title,
  meta,
})
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.article {
  margin: 0 auto;
  max-width: 40rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 1rem 0;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  img {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  @include touch {
    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1rem;
    }
  }
}
</style>
