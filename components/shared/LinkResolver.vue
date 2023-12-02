<template>
  <div>
    <template v-if="profileMode">
      <slot name="extra" />
      <nuxt-link :to="`${route}/${param}`">
        <slot />
      </nuxt-link>
    </template>
    <template v-else>
      <a
        v-safe-href="hrefLink"
        target="_blank"
        rel="nofollow noopener noreferrer">
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
    param?: string
  }>(),
  {
    route: '/rmrk/gallery',
    link: 'rmrk/gallery',
    param: '',
  },
)

const profileMode = !isShareMode
const { origin } = useRequestURL()

const hrefLink = computed(() => `${origin}/${props.link}/${props.param}`)
</script>
