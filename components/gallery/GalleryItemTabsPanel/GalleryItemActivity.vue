<template>
  <div class="gallery-activity-events-wrapper is-flex is-flex-direction-column">
    <div class="events px-5 py-4 is-flex is-flex-direction-column">
      <div class="events-filter is-flex is-flex-wrap-wrap">
        <div
          class="events-checkbox is-flex is-align-items-center"
          @click="checkAll">
          {{ $t('tabs.tabActivity.all') }}
        </div>
        <div
          v-for="(value, name) in filters"
          :key="name"
          class="events-checkbox events-checkbox-container"
          :class="cssActive(value)">
          <input
            :id="name"
            v-model="interactions"
            type="checkbox"
            :value="value"
            class="is-hidden" />
          <label :for="name">
            {{ $t(`tabs.tabActivity.${value}`) }}
          </label>
        </div>
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

const defaultInteractions = [
  'MINTNFT',
  'BUY',
  'LIST',
  'SEND',
  'CONSUME',
  'UNLIST',
]
const interactions = ref(defaultInteractions) // default to all
const filters = {
  mints: 'MINTNFT',
  sales: 'BUY',
  listings: 'LIST',
  transfers: 'SEND',
  burns: 'CONSUME',
}

const checkAll = () => {
  interactions.value = defaultInteractions
}

const cssActive = (value) => {
  return {
    'events-checkbox-active': interactions.value.find(
      (interaction) => interaction === value
    ),
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables.scss';

.gallery-activity-events-wrapper {
  height: 100%;
}

.events {
  @include ktheme() {
    border-bottom: 1px solid theme('border-color');
  }

  &-filter {
    column-gap: 1.5rem;
    row-gap: 1rem;

    @include mobile {
      column-gap: 1rem;
    }
  }

  &-checkbox {
    cursor: pointer;
    text-transform: capitalize;

    label {
      cursor: pointer;
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
    padding: 5px 16px;
  }

  .events-checkbox-active {
    @include ktheme() {
      background-color: theme('k-shade');
      color: theme('black');
    }
  }
}
</style>
