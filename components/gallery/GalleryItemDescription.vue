<template>
  <NeoTabs
    v-model="activeTab"
    expanded
    content-class="o-tabs__content--fixed"
    type="toggle"
    data-testid="gallery-item-description-neotabs"
  >
    <!-- description tab -->
    <NeoTabItem
      value="0"
      :label="$t('tabs.description')"
      class="p-5"
      data-testid="gallery-item-description-tab-content"
    >
      <div
        class="mb-3 flex"
        data-testid="gallery-item-description-tab"
      >
        <span class="mr-2">{{ $t('tabs.tabDescription.made') }}:</span>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <Identity
            ref="identity"
            :address="nft?.issuer"
          />
        </nuxt-link>
      </div>

      <Markdown
        v-if="nftMetadata"
        :source="descSource"
        class="gallery-item-desc-markdown"
      />
    </NeoTabItem>

    <!-- properties tab -->
    <NeoTabItem
      value="1"
      :disabled="propertiesTabDisabled"
      :label="$t('tabs.properties')"
      class="p-5"
    >
      <template #header>
        <NeoTooltip
          v-if="propertiesTabDisabled"
          :label="$t('tabs.noPropertiesForNFT')"
          stop-events
          append-to-body
        >
          {{ $t('tabs.properties') }}
        </NeoTooltip>
        <div v-else>
          {{ $t('tabs.properties') }}
        </div>
      </template>

      <NeoTable
        v-if="properties?.length"
        :data="properties"
        hoverable
      >
        <NeoTableColumn
          v-slot="props"
          field="trait_type"
          :label="$t('tabs.tabProperties.section')"
        >
          {{ props.row.trait_type }}
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          field="value"
          label="Trait"
        >
          {{ props.row.value }}
        </NeoTableColumn>
      </NeoTable>
      <div v-else />
    </NeoTabItem>

    <!-- details tab -->
    <NeoTabItem
      value="2"
      :label="$t('tabs.details')"
      class="p-5"
      data-testid="gallery-item-details-tab-content"
    >
      <!-- <div class="flex justify-between">
        <p>Contract Address</p>
        <p>--</p>
      </div> -->
      <div class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.creator') }}</p>
        <nuxt-link
          v-if="nft?.issuer"
          :to="`/${urlPrefix}/u/${nft?.issuer}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <Identity
            ref="identity"
            :address="nft?.issuer"
          />
        </nuxt-link>
      </div>
      <div
        class="flex justify-between"
        data-testid="item-details-chain"
      >
        <p>{{ $t('tabs.tabDetails.blockchain') }}</p>
        <p>{{ urlPrefix }}</p>
      </div>

      <!-- <div class="flex justify-between">
        <p>Token Standard</p>
        <p>--</p>
      </div> -->
      <div
        v-if="nft?.royalty"
        class="flex justify-between"
        data-testid="item-details-royalty"
      >
        <p>{{ $t('tabs.tabDetails.royalties') }}</p>
        <p>{{ nft?.royalty }}%</p>
      </div>

      <div
        v-if="recipient"
        class="recipient flex justify-between capitalize"
        data-testid="item-details-royalty-recipient"
      >
        <p>{{ $t('transfers.recipients') }}</p>
        <template v-if="Array.isArray(recipient) && recipient.length > 1">
          <ol>
            <li
              v-for="[addr, percentile] in recipient"
              :key="addr"
              class=""
            >
              <nuxt-link
                :to="`/${urlPrefix}/u/${addr}`"
                class="text-k-blue hover:text-k-blue-hover inline-block"
              >
                <Identity
                  ref="identity"
                  :address="addr"
                />
              </nuxt-link>
              <span className="text-xs">({{ percentile }}%)</span>
            </li>
          </ol>
        </template>
        <template v-else-if="Array.isArray(recipient) && recipient.length === 1">
          <nuxt-link
            :to="`/${urlPrefix}/u/${recipient[0][0]}`"
            class="text-k-blue hover:text-k-blue-hover"
          >
            <Identity
              ref="identity"
              :address="recipient[0][0]"
            />
          </nuxt-link>
        </template>
        <template v-else>
          <nuxt-link
            :to="`/${urlPrefix}/u/${recipient}`"
            class="text-k-blue hover:text-k-blue-hover"
          >
            <Identity
              ref="identity"
              :address="recipient"
            />
          </nuxt-link>
        </template>
      </div>

      <hr class="my-2">
      <div
        v-if="mediaUrl"
        class="flex justify-between"
      >
        <p>{{ $t('tabs.tabDetails.media') }}</p>
        <div>
          <a
            v-safe-href="mediaUrl"
            class="text-k-blue hover:text-k-blue-hover"
            data-testid="media-link"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {{ nftMimeType }}
          </a>
        </div>
      </div>
      <div
        v-if="animatedMediaUrl"
        class="flex justify-between"
      >
        <p>{{ $t('tabs.tabDetails.animatedMedia') }}</p>
        <div>
          <a
            v-safe-href="animatedMediaUrl"
            class="text-k-blue hover:text-k-blue-hover"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {{ nftAnimationMimeType }}
          </a>
        </div>
      </div>
      <div class="flex justify-between">
        <p>{{ $t('tabs.tabDetails.metadata') }}</p>
        <a
          v-safe-href="metadataURL"
          class="text-k-blue hover:text-k-blue-hover"
          target="_blank"
          rel="nofollow noopener noreferrer"
          data-testid="metadata-link"
        >{{ metadataMimeType }}</a>
      </div>
    </NeoTabItem>
  </NeoTabs>
</template>

<script setup lang="ts">
import {
  NeoTabItem,
  NeoTable,
  NeoTableColumn,
  NeoTabs,
  NeoTooltip,
} from '@kodadot1/brick'
import Identity from '@/components/identity/IdentityIndex.vue'
import Markdown from '@/components/shared/Markdown.vue'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const { urlPrefix } = usePrefix()

const { getNft: nft, getNftMetadata: nftMetadata, getNftImage: nftImage, getNftMimeType: nftMimeType, getNftAnimation: nftAnimation, getNftAnimationMimeType: nftAnimationMimeType } = storeToRefs(useNftStore())

const activeTab = ref('0')

const descSource = computed(() => {
  return nftMetadata.value?.description?.replaceAll('\n', '  \n') || ''
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
    }
    catch (e) {
      return nft.value?.recipient
    }
  }

  return undefined
})

defineExpose({ isLewd })

const properties = computed(() => {
  const attributes = nftMetadata.value?.attributes || [] as Array<{
    trait?: string
    trait_type: string
    value: string
    key?: string
  }>

  return attributes.map(({ trait, trait_type, key, value }) => ({
    trait_type: trait || trait_type || key || '',
    value: value || '',
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
    return sanitizeIpfsUrl(nft.value?.meta?.image)
  }

  return nftImage.value
})

const animatedMediaUrl = computed(() => {
  if (isCloudflareStream(nftAnimation.value)) {
    return sanitizeIpfsUrl(nft.value?.meta?.animation_url)
  }

  return nftAnimation.value
})
</script>
