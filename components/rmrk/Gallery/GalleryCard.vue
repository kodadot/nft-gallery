<template>
  <div class="card nft-card relative overflow-hidden rounded-none">
    <LinkResolver
      class="nft-card__skeleton"
      :route="route"
      :link="link"
      :param="id"
      tag="a"
    >
      <div class="card-image border border-k-grey">
        <span
          v-if="emoteCount"
          class="card-image__emotes"
        >
          <NeoIcon icon="heart" />
          <span class="align-text-bottom">{{ emoteCount }}</span>
        </span>
        <BaseMediaItem
          :src="image"
          :animation-src="animatedUrl"
          :mime-type="mimeType"
          :audio-player-cover="image"
          enable-normal-tag
          audio-hover-on-cover-play
        />
        <span
          v-if="parseInt(price) > 0 && showPriceValue"
          class="card-image__price"
        >
          <CommonTokenMoney
            :value="price"
            inline
          />
        </span>
      </div>

      <div
        v-if="!hideName"
        class="card-content rounded-none"
      >
        <span
          class="text-center text-k-primary"
          :class="{ 'title is-4': largeDisplay }"
          :title="name"
        >
          <div
            class="overflow-hidden whitespace-nowrap text-ellipsis text-white"
          >
            {{ nftName }}
          </div>
        </span>
      </div>
    </LinkResolver>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { getMimeType } from '@/utils/gallery/media'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { NFTMetadata } from '@/types'
import { usePreferencesStore } from '@/stores/preferences'

const props = withDefaults(
  defineProps<{
    route?: string
    link?: string
    id: string
    name?: string
    emoteCount?: string | number
    price?: string
    metadata: string
    currentOwner: string
    listed?: boolean
    hideName: boolean
  }>(),
  {
    route: '/ahp/gallery',
    link: 'ahp/gallery',
    name: '',
    emoteCount: '',
    listed: true,
    price: '0',
  },
)

const { placeholder } = useTheme()
const image = ref(placeholder.value)
const title = ref('')
const animatedUrl = ref('')
const mimeType = ref('')
const preferencesStore = usePreferencesStore()

watchEffect(async () => {
  if (props.metadata) {
    const meta = await processSingleMetadata<NFTMetadata>(props.metadata)

    image.value = sanitizeIpfsUrl(
      meta.image || meta.thumbnailUri || meta.mediaUri,
    )
    title.value = meta.name
    animatedUrl.value = sanitizeIpfsUrl(
      meta.animation_url || meta.mediaUri || '',
      'image',
    )
    mimeType.value = (await getMimeType(animatedUrl.value || image.value)) || ''
  }
})

const showPriceValue = computed(
  () => props.listed || preferencesStore.getShowPriceValue,
)
const nftName = computed(() => props.name || title.value || '--')
const largeDisplay = computed(
  () => preferencesStore.getLayoutClass === 'is-half-desktop is-half-tablet',
)
</script>
