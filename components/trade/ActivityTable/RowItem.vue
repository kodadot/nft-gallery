<template>
  <div
    v-if="item"
    class="flex items-center justify-between w-min"
    :class="containerSpacing"
  >
    <nuxt-link
      :to="itemPath"
      class="h-[50px]"
    >
      <BaseMediaItem
        class="border border-k-shade w-[3.125rem] h-[3.125rem] !shadow-none"
        :alt="item.name"
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
          {{ item.name }}
        </span>
      </nuxt-link>

      <TradeActivityTableSurchargeTag :value="surcharge" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import type { SwapSurcharge } from '@/composables/transaction/types'

type ItemMedia = { image: string, animationUrl: string }

const props = withDefaults(
  defineProps<{
    item: { id: string, name: string } | undefined
    surcharge: SwapSurcharge | undefined
    containerSpacing?: string
  }>(),
  {
    containerSpacing: 'gap-5',
  },
)

const image = ref()
const animationUrl = ref()

const { urlPrefix } = usePrefix()

const itemPath = computed(() => `/${urlPrefix.value}/gallery/${props.item?.id}`)

const getItem = async (id: string): Promise<ItemMedia> => {
  const nft = await fetchNft(id)

  if (!nft.metadata) {
    return {
      image: '',
      animationUrl: '',
    }
  }

  const meta = await getNftMetadata(nft)

  return {
    image: meta.image,
    animationUrl: meta.animationUrl,
  }
}

watch(() => props.item?.id, async (id) => {
  if (id) {
    const item = await getItem(id)
    image.value = item.image
    animationUrl.value = item.animationUrl
  }
}, { immediate: true })
</script>
