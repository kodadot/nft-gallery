<template>
  <NeoTabs
    v-model="activeTab"
    expanded
    content-class="o-tabs__content--fixed"
    type="toggle">
    <!-- description tab -->
    <NeoTabItem value="0" :label="$t('tabs.description')" class="p-5">
      <div class="mb-3 is-flex">
        <span class="mr-2">{{ $t('tabs.tabDescription.made') }}:</span>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="has-text-link">
          <Identity ref="identity" :address="nft?.issuer" />
        </nuxt-link>
      </div>

      <Markdown :source="descSource" class="gallery-item-desc-markdown" />
    </NeoTabItem>

    <!-- properties tab -->
    <NeoTabItem
      value="1"
      :disabled="propertiesTabDisabled"
      :label="$t('tabs.properties')"
      class="p-5">
      <template #header>
        <NeoTooltip
          v-if="propertiesTabDisabled"
          :label="$t('tabs.noPropertiesForNFT')"
          stop-events
          append-to-body>
          {{ $t('tabs.properties') }}
        </NeoTooltip>
        <div v-else>
          {{ $t('tabs.properties') }}
        </div>
      </template>

      <NeoTable v-if="properties?.length" :data="properties" hoverable>
        <NeoTableColumn
          v-slot="props"
          field="trait_type"
          :label="$t('tabs.tabProperties.section')">
          {{ props.row.trait_type }}
        </NeoTableColumn>
        <NeoTableColumn v-slot="props" field="value" label="Trait">
          {{ props.row.value }}
        </NeoTableColumn>
      </NeoTable>
      <div v-else></div>
    </NeoTabItem>

    <!-- details tab -->
    <NeoTabItem value="2" :label="$t('tabs.details')" class="p-5">
      <!-- <div class="is-flex is-justify-content-space-between">
        <p>Contract Address</p>
        <p>--</p>
      </div> -->
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.creator') }}</p>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="has-text-link">
          <Identity ref="identity" :address="nft?.issuer" />
        </nuxt-link>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.blockchain') }}</p>
        <p>{{ urlPrefix }}</p>
      </div>
      <div v-if="version" class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.version') }}</p>
        <p>{{ version }}</p>
      </div>
      <!-- <div class="is-flex is-justify-content-space-between">
        <p>Token Standard</p>
        <p>--</p>
      </div> -->
      <div v-if="nft?.royalty" class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.royalties') }}</p>
        <p>{{ nft?.royalty }}%</p>
      </div>
      <hr class="my-2" />
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.media') }}</p>
        <a
          :href="nftAnimation || nftImage"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="has-text-link"
          data-cy="media-link"
          >{{ nftMimeType }}</a
        >
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.metadata') }}</p>
        <a
          class="has-text-link"
          :href="metadataURL"
          target="_blank"
          rel="nofollow noopener noreferrer"
          data-cy="metadata-link"
          >{{ metadataMimeType }}</a
        >
      </div>
    </NeoTabItem>

    <!-- parent tab -->
    <div v-if="parent">
      <NeoTabItem value="3" :label="$t('tabs.parent')" class="p-5">
        <nuxt-link :to="parentNftUrl">
          <MediaItem
            :key="parent?.nftImage"
            :class="{
              'is-flex is-align-items-center is-justify-content-center h-audio':
                resolveMedia(parent?.nftMimeType.value) == MediaType.AUDIO,
            }"
            class="gallery-parent-item"
            :src="parent?.nftImage.value"
            :animation-src="parent?.nftAnimation.value"
            :mime-type="parent?.nftMimeType.value"
            :title="parent?.nftMetadata?.value?.name"
            is-detail />
          <p class="gallery-parent-item__name">
            {{ parent?.nftMetadata?.value?.name }}
          </p>
        </nuxt-link>
      </NeoTabItem>
    </div>
  </NeoTabs>
</template>

<script setup lang="ts">
import {
  MediaItem,
  NeoTabItem,
  NeoTable,
  NeoTableColumn,
  NeoTabs,
  NeoTooltip,
} from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import { GalleryItem, useGalleryItem } from './useGalleryItem'

import { MediaType } from '@/components/rmrk/types'
import { resolveMedia } from '@/utils/gallery/media'

import { replaceSingularCollectionUrlByText } from '@/utils/url'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  galleryItem: GalleryItem
}>()

const getValue = (prop) => computed(() => props.galleryItem[prop].value)

const nft = getValue('nft')
const nftMetadata = getValue('nftMetadata')
const nftMimeType = getValue('nftMimeType')
const nftImage = getValue('nftImage')
const nftAnimation = getValue('nftAnimation')

const activeTab = ref('0')
const { version } = useRmrkVersion()

const descSource = computed(() => {
  return replaceSingularCollectionUrlByText(
    nftMetadata.value?.description?.replaceAll('\n', '  \n') || ''
  )
})
const parent = computed(() => {
  if (nft.value?.parent?.id) {
    return useGalleryItem(nft.value?.parent?.id)
  }
})
const isLewd = computed(() => {
  return Boolean(
    properties.value?.find((item) => {
      return item.trait_type === 'NSFW'
    })
  )
})

defineExpose({ isLewd })

const parentNftUrl = computed(() => {
  if (parent.value) {
    const url = inject('itemUrl', 'gallery') as string

    return `/${urlPrefix.value}/${url}/${parent.value?.nft.value?.id}`
  }
})

const properties = computed(() => {
  const attributes = (nftMetadata.value?.attributes ||
    nftMetadata.value?.meta.attributes ||
    []) as Array<{ trait_type: string; value: string; key?: string }>

  return attributes.map(({ trait_type, key, value }) => ({
    trait_type: trait_type || key,
    value,
  }))
})

const propertiesTabDisabled = computed(() => {
  if (!nftMetadata.value) {
    return false
  }

  return !properties.value?.length
})

const metadataMimeType = ref('application/json')
const metadataURL = ref('')

watchEffect(async () => {
  if (nft.value?.metadata) {
    const sanitizeMetadata = sanitizeIpfsUrl(nft.value?.metadata)
    const response = await fetch(sanitizeMetadata, {
      method: 'HEAD',
    })

    metadataMimeType.value =
      response.headers.get('content-type') || 'application/json'
    metadataURL.value = sanitizeMetadata
  }
})
</script>
