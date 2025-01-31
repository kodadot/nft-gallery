<template>
  <div
    class="flex items-center justify-between w-min"
    :class="containerSpacing"
  >
    <nuxt-link
      :to="itemPath"
      class="h-[50px]"
    >
      <BaseMediaItem
        class="border border-k-shade w-[3.125rem] h-[3.125rem]"
        :alt="name"
        :src="image"
        :animation-src="!image ? animationUrl : undefined"
        preview
        is-detail
      />
    </nuxt-link>

    <div class="flex flex-col justify-between">
      <nuxt-link
        class="is-ellipsis inline-block"
        :to="itemPath"
      >
        <span class="font-bold overflow-hidden">
          {{ name }}
        </span>
      </nuxt-link>

      <TradeActivityTablePriceTag :value="price" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

type Item = { image: string, animationUrl: string, name: string }

const props = withDefaults(
  defineProps<{
    id: string | undefined
    price: string | undefined
    containerSpacing?: string
  }>(),
  {
    containerSpacing: 'gap-5',
  }
)

const image = ref()
const animationUrl = ref()
const name = ref()

const { urlPrefix } = usePrefix()

const itemPath = computed(() => `/${urlPrefix.value}/gallery/${props.id}`)

const getItem = async (id: string): Promise<Item> => {
  const nft = await fetchNft(id)

  if (!nft.metadata) {
    return {
      name: '',
      image: '',
      animationUrl: '',
    }
  }

  const meta = await getNftMetadata(nft)

  return {
    name: meta.name,
    image: meta.image,
    animationUrl: meta.animationUrl,
  }
}

watch(() => props.id, async (id) => {
  if (id) {
    const item = await getItem(id)
    image.value = item.image
    animationUrl.value = item.animationUrl
    name.value = item.name
  }
}, { immediate: true })
</script>
