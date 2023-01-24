<template>
  <div>
    <div class="events p-5">
      <div class="events-filter is-flex">
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

const defaultInteractions = ['MINTNFT', 'BUY', 'LIST', 'SEND', 'CONSUME']
const interactions = ref(['BUY']) // default to sales
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

.dark-mode .events {
  border-bottom: 1px solid white;
}

.events {
  border-bottom: 1px solid black;

  &-filter {
    gap: 2rem;
  }

  &-checkbox {
    cursor: pointer;
    text-transform: capitalize;

    label {
      cursor: pointer;
    }

    &:hover {
      color: $shade;
    }

    &-active {
      font-weight: bold;
    }
  }
}
</style>
