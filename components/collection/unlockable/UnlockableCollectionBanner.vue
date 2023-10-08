<template>
  <div class="collection-banner" :style="{ backgroundImage: `url(${banner})` }">
    <div class="collection-banner-shadow"></div>

    <section class="h-full py-8">
      <div class="container is-fluid collection-banner-content">
        <div class="is-flex is-flex-direction-column is-align-items-start">
          <div class="collection-banner-avatar">
            <img :src="image" alt="avatar" class="object-fit-cover" />
          </div>
          <h1 class="collection-banner-name">{{ title }}</h1>
        </div>
        <HeroButtons class="is-hidden-mobile is-align-self-flex-end" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroButtons from '@/components/collection/unlockable/UnlockableHeroButtons.vue'
import { unlockableDesc } from '../unlockable/utils'
import { VOTE_DROP_DESCRIPTION } from '../voteDrop/const'
import { generateDropImage } from '@/utils/seoImageGenerator'

const props = defineProps<{
  type: string | undefined
}>()
const route = useRoute()

const title = computed(() => {
  switch (props.type) {
    case 'vote-drop':
      return 'Referendum Mint'
    case 'dot-drop':
      return 'Waifu 1 DOT Mint'
    default:
      return 'Waifu T-Shirt Free Mint'
  }
})

const banner = computed(() => {
  switch (props.type) {
    case 'vote-drop':
      return '/drop/vote-drop-banner.webp'
    default:
      return '/unlockable-banner.svg'
  }
})

const image = computed(() => {
  switch (props.type) {
    case 'vote-drop':
      return '/drop/vote-drop-avatar.webp'
    case 'dot-drop':
      return 'https://replicate.delivery/pbxt/te3utBZeR4kbi0u1Xrsrz6VhZScDhElj9ZFTKQ3fRPRYHTUiA/out-0.png'
    case 'free-drop':
      return 'https://replicate.delivery/pbxt/bANqMENrH1LCDdpkhycwYj5nO03pII7TFjpEfTUbTt3uvXmIA/out-2.png'
    default:
      return 'https://replicate.delivery/pbxt/Cxfhi4qeTNvn6kcrrKlvL1YUPBKeAmbNrrf2ATtPVd6o5gDEB/out-1.png'
  }
})

const description = computed(() => {
  switch (props.type) {
    case 'vote-drop':
      return VOTE_DROP_DESCRIPTION
    case 'dot-drop':
      return unlockableDesc(50)
    case 'free-drop':
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

  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
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
    padding: 0.75rem;

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
    font-weight: bold;
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
