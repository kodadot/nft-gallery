<template>
  <div class="gallery-activity-events-wrapper flex flex-col">
    <div class="events py-5 px-6 flex flex-col">
      <div
        class="events-filter flex flex-wrap"
        data-testid="events-filter"
      >
        <a
          class="capitalize flex items-center"
          data-testid="gallery-item-activity-filter-all"
          @click="checkAll"
        >
          {{ $t('tabs.tabActivity.all') }}
        </a>

        <label
          v-for="(value, name) in filters"
          :key="name"
          class="cursor-pointer capitalize events-checkbox-container"
          :data-testid="name"
          :class="cssActive(value)"
        >
          <input
            :id="name"
            v-model="interactions"
            type="checkbox"
            :value="value"
            class="is-hidden"
          >
          <span :for="name">
            {{ $t(`tabs.tabActivity.${value}`) }}
          </span>
        </label>
      </div>
    </div>

    <GalleryItemActivityTable
      :key="interactions.join('')"
      :nft-id="nftId"
      :interactions="interactions"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItemActivityTable from './GalleryItemActivityTable.vue'

defineProps<{
  nftId: string
}>()

const defaultInteractions = ['BUY', 'LIST']

const allInteractions = ['MINTNFT', 'BUY', 'LIST', 'SEND', 'CONSUME']

const interactions = ref(defaultInteractions)
const filters = {
  mints: 'MINTNFT',
  sales: 'BUY',
  listings: 'LIST',
  transfers: 'SEND',
  burns: 'CONSUME',
}

const checkAll = () => {
  interactions.value = allInteractions
}

const cssActive = (value) => {
  return {
    'events-checkbox-active': interactions.value.find(
      interaction => interaction === value,
    ),
  }
}
</script>
