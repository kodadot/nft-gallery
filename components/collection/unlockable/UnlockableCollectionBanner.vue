<template>
  <div class="collection-banner" :style="{ backgroundImage: `url(${banner})` }">
    <div class="collection-banner-shadow"></div>

    <section class="h-[368px] md:h-full">
      <div
        :class="[
          'container h-full flex',
          'justify-end items-start flex-col',
          'md:justify-between md:items-end md:flex-row',
          { 'is-fluid': !isFullHD },
        ]">
        <div class="flex flex-col items-start max-md:mb-8 md:h-[212px]">
          <div class="collection-banner-avatar">
            <NuxtImg
              height="88"
              densities="2x"
              :src="image"
              alt="avatar"
              class="object-cover" />
          </div>
          <h1
            class="collection-banner-name mt-5 text-3xl md:text-4xl font-bold text-text-color-inverse">
            {{ title }}
          </h1>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { unlockableDesc } from '../unlockable/utils'
import { VOTE_DROP_DESCRIPTION } from '../voteDrop/const'
import { generateDropImage } from '@/utils/seoImageGenerator'
import { DropItem } from '@/params/types'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

const route = useRoute()
const { isFullHD } = useViewport()

const title = computed(() => props.drop?.name)

const banner = computed(() => sanitizeIpfsUrl(props.drop?.banner))

const image = computed(() => sanitizeIpfsUrl(props.drop?.image))

const description = computed(() => {
  switch (props.drop?.type) {
    case 'vote':
      return VOTE_DROP_DESCRIPTION
    case 'paid':
      return unlockableDesc(50)
    case 'drop':
      return unlockableDesc(40)
    default:
      return ''
  }
})

const meta = computed(() => {
  return [
    {
      title: title.value,
      url: route.path,
      image: generateDropImage(title.value, image.value),
      description: description.value,
    },
  ]
})

useHead({
  title,
  meta,
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.collection-banner {
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  @include desktop {
    height: 560px;
  }

  &-shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.2));
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &-avatar {
    padding: 0.625rem;

    @include ktheme() {
      border: 1px solid theme('border-color');
      background-color: theme('background-color');
      box-shadow: theme('primary-shadow');
    }

    img {
      display: block;
      width: 5.5rem;
      height: 5.5rem;
      border: 1px solid;
    }
  }

  &-name {
    @include ktheme() {
      text-shadow:
        1px 1px 0 theme('text-color'),
        1px -1px 0 theme('text-color'),
        -1px 1px 0 theme('text-color'),
        -1px -1px 0 theme('text-color'),
        1px 0px 0 theme('text-color'),
        0px 1px 0 theme('text-color'),
        -1px 0px 0 theme('text-color'),
        0px -1px 0 theme('text-color'),
        4px 4px theme('text-color');
    }
  }
}
</style>
