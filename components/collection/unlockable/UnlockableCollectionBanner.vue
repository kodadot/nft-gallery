<template>
  <div
    class="collection-banner"
    :style="bannerBackgroundStyles"
  >
    <div class="collection-banner-shadow" />

    <section class="h-[368px] lg:h-full">
      <div
        class="relative w-full mx-auto px-[1.25rem] md:px-[2.5rem] min-[1440px]:max-w-[1440px] h-full flex justify-end items-start flex-col md:justify-between md:items-end md:flex-row"
      >
        <div class="flex flex-col items-start max-md:mb-8 md:h-[212px]">
          <div class="collection-banner-avatar">
            <img
              v-if="image"
              :src="image"
              alt="avatar"
              class="object-cover"
              height="88px"
            >
          </div>
          <h1
            class="collection-banner-name mt-5 text-3xl md:text-4xl font-bold text-text-color-inverse"
          >
            {{ title }}
          </h1>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { unlockableDesc } from '../unlockable/utils'
import { generateDropImage } from '@/utils/seoImageGenerator'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { useDrop } from '~/components/drops/useDrops'

const { drop } = useDrop()

const route = useRoute()
const img = useImage()

const title = computed(() => drop.value?.name)

const banner = computed(() => sanitizeIpfsUrl(drop.value?.banner))

const image = computed(() => sanitizeIpfsUrl(drop.value?.image))

const bannerBackgroundStyles = computed(() => {
  if (banner.value) {
    const imgUrl = img(banner.value, { width: window.innerWidth })
    return { backgroundImage: `url('${imgUrl}')` }
  }
  return {}
})

const description = computed(() => {
  switch (drop.value?.type) {
    case 'paid':
      return unlockableDesc(50)
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
