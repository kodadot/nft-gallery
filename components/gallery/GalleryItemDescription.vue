<template>
  <o-tabs v-model="activeTab" expanded>
    <o-tab-item value="0" label="Properties" class="py-4">
      <table class="simple-table">
        <thead>
          <tr>
            <td>Trait</td>
            <td>Section</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="attribute in nftMetadata?.attributes"
            :key="attribute.value">
            <td>{{ attribute.value }}</td>
            <td>{{ attribute.trait_type }}</td>
          </tr>
        </tbody>
      </table>
    </o-tab-item>

    <o-tab-item value="1" label="Description" class="p-5">
      <div class="mb-3 is-flex">
        <span class="mr-2">Made By:</span>
        <a
          v-if="nft?.issuer"
          :href="`/${urlPrefix}/u/${nft?.issuer}`"
          target="_blank"
          rel="noopener noreferrer"
          class="has-text-weight-bold">
          <Identity ref="identity" :address="nft?.issuer" />
        </a>
      </div>

      <!-- TODO: render with markdown component -->
      <div>{{ nftMetadata?.description }}</div>
    </o-tab-item>

    <o-tab-item value="2" label="Details" class="p-5">
      <div class="is-flex is-justify-content-space-between">
        <p>Contract Address</p>
        <p>--</p>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>Creator</p>
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
        <p>Blockchain</p>
        <p>{{ urlPrefix }}</p>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>Token Standard</p>
        <p>--</p>
      </div>
      <div v-if="nft?.royalty" class="is-flex is-justify-content-space-between">
        <p>Royalties</p>
        <p>{{ nft?.royalty }}%</p>
      </div>
      <hr class="my-2" />
      <div class="is-flex is-justify-content-space-between">
        <p>Media</p>
        <p>{{ nftMimeType }}</p>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <p>Metadata</p>
        <p>--</p>
      </div>
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'
import Identity from '@/components/identity/IdentityIndex.vue'

import { useGalleryItem } from './useGalleryItem'

const { urlPrefix } = usePrefix()
const { nft, nftMimeType, nftMetadata } = useGalleryItem()

const activeTab = ref('0')
</script>
