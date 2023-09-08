<template>
  <div>
    <template v-if="items && !horizontalLayout">
      <Layout />
    </template>
    <div :id="scrollContainerId" class="columns is-multiline">
      <div
        v-for="nft in items"
        :key="nft.id"
        :class="`column ${classLayout} column-padding ${scrollItemClassName}`">
        <GalleryCard
          :id="nft.id"
          :name="nft.name"
          :route="route"
          :link="link"
          :metadata="metadataOf(nft)"
          :price="nft.price"
          :emote-count="nft.emoteCount"
          :current-owner="nft.currentOwner"
          :listed="listed"
          :data-testid="items.indexOf(nft)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RmrkType } from '@/components/rmrk/service/scheme'
import {
  INFINITE_SCROLL_CONTAINER_ID,
  INFINITE_SCROLL_ITEM_CLASS_NAME,
} from '@/utils/constants'
import { usePreferencesStore } from '@/stores/preferences'

import GalleryCard from './GalleryCard.vue'
import Layout from './Layout.vue'

withDefaults(
  defineProps<{
    route?: string
    link?: string
    items: RmrkType[]
    horizontalLayout: boolean
    listed: boolean
  }>(),
  {
    route: '/rmrk/gallery',
    link: 'rmrk/gallery',
  }
)

const preferencesStore = usePreferencesStore()
const scrollContainerId = ref(INFINITE_SCROLL_CONTAINER_ID)
const scrollItemClassName = ref(INFINITE_SCROLL_ITEM_CLASS_NAME)

const classLayout = computed(() => preferencesStore.getLayoutClass)

const metadataOf = (nft: any) => nft.metadata || nft.collection?.metadata
</script>
