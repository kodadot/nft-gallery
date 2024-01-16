<template>
  <div class="card nft-card">
    <LinkResolver
      class="nft-card__skeleton"
      :route="route"
      :link="link"
      :param="id"
      tag="a">
      <div class="card-image">
        <span v-if="emoteCount" class="card-image__emotes">
          <NeoIcon icon="heart" />
          <span class="card-image__emotes__count">{{ emoteCount }}</span>
        </span>
        <BaseMediaItem
          :src="image"
          :animation-src="animatedUrl"
          :mime-type="mimeType"
          :audio-player-cover="image"
          audio-hover-on-cover-play />
        <span
          v-if="parseInt(price) > 0 && showPriceValue"
          class="card-image__price">
          <CommonTokenMoney :value="price" inline />
        </span>
      </div>

      <div v-if="!hideName" class="card-content">
        <span
          class="has-text-centered has-text-primary"
          :class="{ 'title is-4': largeDisplay }"
          :title="name">
          <div class="has-text-overflow-ellipsis">
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

import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { usePreferencesStore } from '@/stores/preferences'

import LinkResolver from '@/components/shared/LinkResolver.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

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
    route: '/rmrk/gallery',
    link: 'rmrk/gallery',
    name: '',
    emoteCount: '',
    listed: true,
    price: '0',
  },
)

const image = ref('/placeholder.webp')
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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.nft-card {
  position: relative;
  overflow: hidden;
  border-radius: 0px !important;

  .has-text-overflow-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @include ktheme() {
      color: theme('white');
    }
  }

  &__skeleton {
    transition: all 0.3s;

    .card-image {
      &__emotes {
        position: absolute;
        border-radius: 4px;
        padding: 3px 8px;
        top: 10px;
        right: 10px;
        font-size: 14px;
        @apply z-[3];
        transition: all 0.3s;

        @include ktheme() {
          color: theme('white');
          background: theme('k-primary');
        }
      }

      &__price {
        position: absolute;
        border-radius: 4px;
        padding: 3px 8px;
        bottom: 10px;
        left: 10px;
        font-size: 14px;
        @apply z-[3];
        transition: all 0.3s ease;

        @include ktheme() {
          background: theme('k-shade');
          color: theme('white');
        }
      }
    }
  }

  .card-image__emotes__count {
    vertical-align: text-bottom;
  }

  .card-content {
    border-radius: 0;
  }

  @media screen and (min-width: 1024px) {
    .card-content {
      position: absolute;
      bottom: -45px;
      left: 0;
      width: 100%;
      opacity: 0;

      @include ktheme() {
        background: theme('background-color');
      }
    }

    .card-image img {
      transition: all 0.3s ease;
    }

    &:hover .card-content {
      bottom: 0;
      opacity: 1;
      @apply z-[2];
      background: $frosted-glass-background;
      backdrop-filter: $frosted-glass-backdrop-filter;
    }

    &:hover .card-image img {
      transform: scale(1.1) translateY(-5%);
    }

    &:hover .card-image__emotes {
      top: 15px;
      right: 15px;
    }

    &:hover .card-image__price {
      bottom: 62px;
    }
  }
}
</style>

<style lang="scss">
.gallery__image-wrapper img {
  border-radius: 0px !important;
}
</style>
