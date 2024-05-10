<template>
  <div
    class="flex flex-col gap-3"
    :class="{
      'max-h-[260px] overflow-hidden': !expanded,
      'max-h-[390px] overflow-y-auto': expanded,
    }">
    <div
      v-for="item in displayItems"
      :key="item.id"
      class="flex flex-row items-center gap-4">
      <BaseMediaItem
        class="border border-k-shade aspect-square !w-10 !h-10 shrink-0"
        :src="sanitizeIpfsUrl(item.image)"
        :mime-type="item.mimeType"
        preview
        is-detail />

      <div class="flex justify-between w-full">
        <p>{{ item.name }}</p>
        <CommonTokenMoney v-if="showPrice" :value="item.price" />
      </div>
    </div>
  </div>

  <div
    v-if="showMore"
    class="flex mt-4 items-center"
    :class="[expanded ? 'justify-end' : 'justify-between']">
    <div v-if="!expanded" class="flex items-center gap-3">
      <div
        class="bg-k-grey-light px-1 py-1 text-center rounded-full text-k-grey text-xs w-8">
        +{{ moreItems }}
      </div>
      <span class="text-k-grey text-xs">{{ $t('items') }}</span>
    </div>

    <a class="text-xs text-k-grey" @click="expanded = !expanded">{{
      expanded ? $t('showLess') : $t('showAll')
    }}</a>
  </div>

  <div class="mt-5 border-b-k-shade">
    <p class="is-size-6 capitalize font-bold text-center">
      {{ header }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ItemMedia } from './SuccessfulItemsMedia.vue'

const COLLAPSED_ITEMS_COUNT = 5

const props = defineProps<{
  items: ItemMedia[]
  header: string
  showPrice?: boolean
}>()

const expanded = ref(false)

const moreItems = computed(() => props.items.length - COLLAPSED_ITEMS_COUNT)
const showMore = computed(() => props.items.length > COLLAPSED_ITEMS_COUNT)
const displayItems = computed(() =>
  props.items.slice(
    0,
    showMore.value && !expanded.value ? COLLAPSED_ITEMS_COUNT : undefined,
  ),
)
</script>
