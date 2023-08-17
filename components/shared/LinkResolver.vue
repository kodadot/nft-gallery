<template>
  <div>
    <template v-if="profileMode">
      <slot name="extra" />
      <nuxt-link :to="`${route}/${param}`" :tag="tag">
        <slot />
      </nuxt-link>
    </template>
    <template v-else>
      <a :href="hrefLink" target="_blank" rel="nofollow noopener noreferrer">
        <slot />
      </a>
    </template>
  </div>
</template>

<script lang="ts" setup>
import isShareMode from '@/utils/isShareMode'

const props = withDefaults(
  defineProps<{
    route?: string
    link?: string
    tag?: string
    param?: string
  }>(),
  {
    route: '/rmrk/gallery',
    link: 'rmrk/gallery',
    tag: 'a',
    param: '',
  }
)

const profileMode = !isShareMode

const hrefLink = computed(
  () => `${window.location.origin}/${props.link}/${props.param}`
)
</script>
