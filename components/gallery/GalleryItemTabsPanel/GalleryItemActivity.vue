<template>
  <div class="gallery-activity-events-wrapper flex flex-col">
    <div class="events py-5 px-6 flex flex-col">
      <div class="events-filter flex flex-wrap" data-testid="events-filter">
        <a
          class="capitalize flex items-center"
          data-testid="gallery-item-activity-filter-all"
          @click="checkAll">
          {{ $t('tabs.tabActivity.all') }}
        </a>

        <label
          v-for="(value, name) in filters"
          :key="name"
          class="cursor-pointer capitalize events-checkbox-container"
          :data-testid="name"
          :class="cssActive(value)">
          <input
            :id="name"
            v-model="interactions"
            type="checkbox"
            :value="value"
            class="is-hidden" />
          <span :for="name">
            {{ $t(`tabs.tabActivity.${value}`) }}
          </span>
        </label>
      </div>
    </div>

    <GalleryItemActivityTable
      :key="interactions.join('')"
      :nft-id="nftId"
      :interactions="interactions" />
  </div>
</template>

<script setup lang="ts">
import GalleryItemActivityTable from './GalleryItemActivityTable.vue'

defineProps<{
  nftId: string
}>()

const defaultInteractions = ['BUY', 'LIST']

const allInteractions = ['MINTNFT', 'BUY', 'LIST', 'SEND', 'CONSUME', 'UNLIST']

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
      (interaction) => interaction === value,
    ),
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';

.gallery-activity-events-wrapper {
  height: 100%;
}

.events {
  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
  }

  &-filter {
    column-gap: 0.625rem;
    row-gap: 1rem;

    @include mobile {
      column-gap: 1rem;
    }
  }

  .events-checkbox-container {
    @include ktheme() {
      border: 1px solid theme('k-shade');
      &:hover {
        border-color: theme('border-color');
      }
    }
    border-radius: 25px;
    padding: 5px 20px;
  }

  .events-checkbox-active {
    @include ktheme() {
      background-color: theme('k-shade');
      color: theme('black');
    }
  }
}
</style>
