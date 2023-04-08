<template>
  <o-tabs v-model="activeTab" expanded content-class="o-tabs__content--fixed">
    <!-- description tab -->
    <o-tab-item value="0" :label="$t('tabs.description')" class="p-5">
      <div class="mb-3 is-flex">
        <span class="mr-2">{{ $t('tabs.tabDescription.made') }}:</span>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="has-text-link">
          <Identity ref="identity" :address="nft?.issuer" />
        </nuxt-link>
      </div>

      <Markdown
        :source="nftMetadata?.description?.replaceAll('\n', '  \n') || ''"
        class="gallery-item-desc-markdown" />
    </o-tab-item>

    <!-- properties tab -->
    <DisablableTab
      value="1"
      :disabled="propertiesTabDisabled"
      :label="$t('tabs.properties')"
      :disabled-tooltip="$t('tabs.noPropertiesForNFT')">
      <o-table v-if="properties?.length" :data="properties" hoverable>
        <o-table-column
          v-slot="props"
          field="trait_type"
          :label="$t('tabs.tabProperties.section')">
          {{ props.row.trait_type }}
        </o-table-column>
        <o-table-column v-slot="props" field="value" label="Trait">
          {{ props.row.value }}
        </o-table-column>
      </o-table>
    </DisablableTab>

    <!-- details tab -->
    <o-tab-item value="2" :label="$t('tabs.details')" class="p-5">
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
          rel="noopener noreferrer"
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
          rel="noopener noreferrer"
          data-cy="metadata-link"
          >{{ metadataMimeType }}</a
        >
      </div>
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTable, OTableColumn, OTabs } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import { DisablableTab } from '@kodadot1/brick'

import { useGalleryItem } from './useGalleryItem'
import { useRedirectModal } from '@/components/redirect/useRedirectModal'

useRedirectModal('.gallery-item-desc-markdown')
const { urlPrefix } = usePrefix()
const { nft, nftMimeType, nftMetadata, nftImage, nftAnimation } =
  useGalleryItem()
const activeTab = ref('0')

const properties = computed(() => {
  // we have different format between rmrk2 and the other chains
  if (urlPrefix.value === 'rmrk2') {
    return Object.entries(nftMetadata.value?.properties || {}).map(
      ([key, value]) => {
        return {
          trait_type: key,
          value: value.value,
        }
      }
    )
  }

  const attributes = (nftMetadata.value?.attributes ||
    nftMetadata.value?.meta.attributes ||
    []) as Array<{ trait_type: string; value: string; key?: string }>
  return attributes.map((attr) => {
    return {
      trait_type: attr.trait_type || attr.key,
      value: attr.value,
    }
  })
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
