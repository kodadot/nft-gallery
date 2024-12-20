<template>
  <div class="flex flex-col h-full">
    <div class="py-5 px-6 flex flex-col border-b">
      <div
        class="flex flex-wrap gap-x-2.5 gap-y-4 md:gap-x-4"
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
          class="cursor-pointer capitalize px-5 py-[5px] rounded-[25px] border border-k-shade hover:border-border-color"
          :class="{ 'bg-k-shade text-black': interactions.includes(value) }"
          :data-testid="name"
        >
          <input
            :id="name"
            v-model="interactions"
            type="checkbox"
            :value="value"
            class="hidden"
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
</script>
