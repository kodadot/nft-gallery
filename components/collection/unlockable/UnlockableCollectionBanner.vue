<template>
  <div class="collection-banner" :style="{ backgroundImage: `url(${banner})` }">
    <div class="collection-banner-shadow"></div>

    <section class="h-full py-8">
      <div class="container is-fluid collection-banner-content">
        <div class="flex flex-col items-start">
          <div class="collection-banner-avatar">
            <NuxtImg
              height="88"
              densities="2x"
              :src="image"
              alt="avatar"
              class="object-cover" />
          </div>
          <h1 class="collection-banner-name">{{ title }}</h1>
        </div>
        <HeroButtons class="is-hidden-mobile self-end" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroButtons from '@/components/collection/unlockable/UnlockableHeroButtons.vue'
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

  &-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;

    @include mobile {
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
    }
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
    font-weight: 700;
    font-size: 2rem;
    margin-top: 1.5rem;

    @include ktheme() {
      color: theme('text-color-inverse');
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
