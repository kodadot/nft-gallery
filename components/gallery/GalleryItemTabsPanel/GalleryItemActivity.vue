<template>
  <div class="gallery-activity-events-wrapper is-flex is-flex-direction-column">
    <div class="events p-5 is-flex is-flex-direction-column">
      <div class="events-filter is-flex is-flex-wrap-wrap">
        <div class="events-checkbox" @click="checkAll">
          {{ $t('tabs.tabActivity.all') }}
        </div>
        <div
          v-for="(value, name) in filters"
          :key="name"
          class="events-checkbox">
          <input
            :id="name"
            v-model="interactions"
            type="checkbox"
            :value="value"
            class="is-hidden" />
          <label :for="name" :class="cssActive(value)">
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
    column-gap: 2rem;

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

    &:hover {
      @include ktheme() {
        color: theme('k-hovergrey');
      }
    }

    &-active {
      font-weight: bold;
    }
  }
}
</style>
