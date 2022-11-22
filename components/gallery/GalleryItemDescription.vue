<template>
  <o-tabs v-model="activeTab" expanded content-class="o-tabs__content--fixed">
    <!-- properties tab -->
    <o-tab-item
      v-if="nftMetadata?.attributes.length"
      value="0"
      :label="$t('tabs.properties')"
      class="py-5">
      <o-table :data="nftMetadata?.attributes" hoverable>
        <o-table-column
          v-slot="props"
          field="value"
          :label="$t('tabs.tabProperties.trait')">
          {{ props.row.value }}
        </o-table-column>
        <o-table-column
          v-slot="props"
          field="trait_type"
          :label="$t('tabs.tabProperties.section')">
          {{ props.row.trait_type }}
        </o-table-column>
      </o-table>
    </o-tab-item>

    <!-- description tab -->
    <o-tab-item value="1" :label="$t('tabs.description')" class="p-5">
      <div class="mb-3 is-flex">
        <span class="mr-2">{{ $t('tabs.tabDescription.made') }}:</span>
        <a
          v-if="nft?.issuer"
          :href="`/${urlPrefix}/u/${nft?.issuer}`"
          target="_blank"
          rel="noopener noreferrer"
          class="has-text-weight-bold">
          <Identity ref="identity" :address="nft?.issuer" />
        </a>
      </div>

      <vue-markdown
        :source="nftMetadata?.description?.replaceAll('\n', '  \n') || ''"
        :style="{ wordBreak: 'break-word' }" />
    </o-tab-item>

    <!-- details tab -->
    <o-tab-item value="2" :label="$t('tabs.details')" class="p-5">
      <!-- <div class="is-flex is-justify-content-space-between">
        <p>Contract Address</p>
        <p>--</p>
      </div> -->
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.creator') }}</p>
        <a
          v-if="nft?.issuer"
          :href="`/${urlPrefix}/u/${nft?.issuer}`"
          target="_blank"
          rel="noopener noreferrer"
          class="has-text-weight-bold">
          <Identity ref="identity" :address="nft?.issuer" />
        </a>
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
          >{{ nftMimeType }}</a
        >
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>{{ $t('tabs.tabDetails.metadata') }}</p>
        <a :href="metadataURL" target="_blank" rel="noopener noreferrer">{{
          metadataMimeType
        }}</a>
      </div>
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTable, OTableColumn, OTabs } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import VueMarkdown from 'vue-markdown-render'

import { useGalleryItem } from './useGalleryItem'

const { urlPrefix } = usePrefix()
const { nft, nftMimeType, nftMetadata, nftImage, nftAnimation } =
  useGalleryItem()

const activeTab = ref('1')
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

watch(nftMetadata, (metadata) => {
  if (metadata?.attributes.length) {
    activeTab.value = '0'
  }
})
</script>
