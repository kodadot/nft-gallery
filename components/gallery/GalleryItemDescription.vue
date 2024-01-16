<template>
  <o-tabs
    v-model="activeTab"
    expanded
    content-class="o-tabs__content--fixed"
    type="toggle"
    data-testid="gallery-item-description-neotabs">
    <!-- description tab -->
    <o-tab-item
      value="0"
      :label="$t('tabs.description')"
      class="p-5"
      data-testid="gallery-item-description-tab-content">
      <div class="mb-3 flex" data-testid="gallery-item-description-tab">
        <span class="mr-2">{{ $t('tabs.tabDescription.made') }}:</span>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="has-text-link">
          <Identity ref="identity" :address="nft?.issuer" />
        </nuxt-link>
      </div>

      <Markdown
        v-if="nftMetadata"
        :source="descSource"
        class="gallery-item-desc-markdown" />
    </o-tab-item>

    <!-- properties tab -->
    <o-tab-item
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
    </o-tab-item>

    <!-- details tab -->
    <o-tab-item
      value="2"
      :label="$t('tabs.details')"
      class="p-5"
      data-testid="gallery-item-details-tab-content">
      <!-- <div class="flex justify-between">
        <p>Contract Address</p>
        <p>--</p>
      </div> -->
      <div class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.creator') }}</p>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="has-text-link">
          <Identity ref="identity" :address="nft?.issuer" />
        </nuxt-link>
      </div>
      <div class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.blockchain') }}</p>
        <p>{{ urlPrefix }}</p>
      </div>
      <div v-if="version" class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.version') }}</p>
        <p>{{ version }}</p>
      </div>
      <!-- <div class="flex justify-between">
        <p>Token Standard</p>
        <p>--</p>
      </div> -->
      <div v-if="nft?.royalty" class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.royalties') }}</p>
        <p>{{ nft?.royalty }}%</p>
      </div>

      <div v-if="recipient" class="recipient flex justify-between capitalize">
        <p>{{ $t('transfers.recipients') }}</p>
        <template v-if="Array.isArray(recipient) && recipient.length > 1">
          <ol>
            <li v-for="[addr, percentile] in recipient" :key="addr" class="">
              <nuxt-link
                :to="`/${urlPrefix}/u/${addr}`"
                class="has-text-link is-inline-block">
                <Identity ref="identity" :address="addr" />
              </nuxt-link>
              <span className="text-xs">({{ percentile }}%)</span>
            </li>
          </ol>
        </template>
        <template
          v-else-if="Array.isArray(recipient) && recipient.length === 1">
          <nuxt-link
            :to="`/${urlPrefix}/u/${recipient[0][0]}`"
            class="has-text-link">
            <Identity ref="identity" :address="recipient[0][0]" />
          </nuxt-link>
        </template>
        <template v-else>
          <nuxt-link :to="`/${urlPrefix}/u/${recipient}`" class="has-text-link">
            <Identity ref="identity" :address="recipient" />
          </nuxt-link>
        </template>
      </div>

      <hr class="my-2" />
      <div v-if="mediaUrl" class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.media') }}</p>
        <div>
          <a
            v-safe-href="mediaUrl"
            class="has-text-link"
            data-testid="media-link"
            target="_blank"
            rel="nofollow noopener noreferrer">
            {{ nftMimeType }}
          </a>
        </div>
      </div>
      <div v-if="animatedMediaUrl" class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.animatedMedia') }}</p>
        <div>
          <a
            v-safe-href="animatedMediaUrl"
            class="has-text-link"
            target="_blank"
            rel="nofollow noopener noreferrer">
            {{ nftAnimationMimeType }}
          </a>
        </div>
      </div>
      <div class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.metadata') }}</p>
        <a
          v-safe-href="metadataURL"
          class="has-text-link"
          target="_blank"
          rel="nofollow noopener noreferrer"
          data-testid="metadata-link"
          >{{ metadataMimeType }}</a
        >
      </div>
    </o-tab-item>

    <!-- parent tab -->
    <div v-if="parent">
      <o-tab-item value="3" :label="$t('tabs.parent')" class="p-5">
        <nuxt-link :to="parentNftUrl">
          <BaseMediaItem
            :key="parent?.nftImage"
            :class="{
              'flex items-center justify-center h-audio':
                resolveMedia(parent?.nftMimeType.value) == MediaType.AUDIO,
            }"
            class="gallery-parent-item"
            :src="parent?.nftImage.value"
            :animation-src="parent?.nftAnimation.value"
            :title="parent?.nftMetadata?.value?.name"
            is-detail />
          <p class="gallery-parent-item__name">
            {{ parent?.nftMetadata?.value?.name }}
          </p>
        </nuxt-link>
      </o-tab-item>
    </div>
  </o-tabs>
</template>

<script setup lang="ts">
import { NeoTable, NeoTableColumn, NeoTooltip } from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import Markdown from '@/components/shared/Markdown.vue'

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
const nftAnimationMimeType = getValue('nftAnimationMimeType')

const activeTab = ref('0')
const { version } = useRmrkVersion()

const descSource = computed(() => {
  return replaceSingularCollectionUrlByText(
    nftMetadata.value?.description?.replaceAll('\n', '  \n') || '',
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
    }),
  )
})

const recipient = computed(() => {
  if (nft.value?.recipient) {
    try {
      return JSON.parse(nft.value?.recipient)
    } catch (e) {
      return nft.value?.recipient
    }
  }
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
    nftMetadata.value?.meta?.attributes ||
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

const metadataMimeType = 'application/json'
const metadataURL = computed(() => sanitizeIpfsUrl(nft.value?.metadata))

const isCloudflareStream = (url: string) => url.includes('cloudflarestream.com')

const mediaUrl = computed(() => {
  if (isCloudflareStream(nftImage.value)) {
    return sanitizeIpfsUrl(nft.value.meta?.image)
  }

  return nftImage.value
})

const animatedMediaUrl = computed(() => {
  if (isCloudflareStream(nftAnimation.value)) {
    return sanitizeIpfsUrl(nft.value.meta?.animation_url)
  }

  return nftAnimation.value
})
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.recipient {
  li {
    gap: 0.3rem;
    > span {
      font-size: 0.8rem;
      @include ktheme() {
        color: theme('k-grey');
      }
    }
  }
}
</style>
