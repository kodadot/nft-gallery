<template>
  <div class="notification-modal-container is-flex is-flex-direction-column">
    <header class="modal-card-head mb-4">
      <span class="modal-card-title is-size-6 has-text-weight-bold">
        Notifications
      </span>
      <a class="is-flex is-align-items-center" @click="emit('close')">
        <NeoIcon icon="close" />
      </a>
    </header>
    <div class="modal-card-body">
      <div class="notification-filter pb-5">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center pb-4">
          <span> Filters </span>
          <NeoButton
            v-if="!showFilter"
            no-shadow
            class="button-rounded"
            @click.native="showFilter = !showFilter">
            Add
            <NeoIcon icon="plus" size="small" />
          </NeoButton>
          <NeoButton
            v-else
            no-shadow
            class="button-rounded"
            @click.native="showFilter = !showFilter">
            Done
            <NeoIcon icon="check" size="small" />
          </NeoButton>
        </div>
        <div v-if="showFilter" class="filter-option">
          <div class="is-flex is-flex-direction-column pb-4">
            <span class="is-size-7 has-text-grey mb-2">By collection</span>
            <div class="is-flex filter-list">
              <div
                v-for="(item, index) in collections"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 no-wrap"
                :class="{
                  activated: filters.collection.includes(item),
                }"
                @click="toggleFilter('collection', item)">
                {{ item }}
              </div>
            </div>
          </div>
          <div class="is-flex is-flex-direction-column pb-4">
            <span class="is-size-7 has-text-grey mb-2">By event</span>
            <div class="is-flex filter-list">
              <div
                v-for="(item, index) in events"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 no-wrap"
                :class="{
                  activated: filters.event.includes(item),
                }"
                @click="toggleFilter('event', item)">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!showFilter && !isFilterEmpty" class="filter-option">
          <div class="is-flex filter-display-list pb-4">
            <div
              v-for="(item, index) in filters.collection"
              :key="`${item}-${index}`"
              class="filter-item no-wrap mr-1 px-3 py-1">
              {{ item }}
              <NeoIcon
                icon="xmark"
                @click.native="toggleFilter('collection', item)" />
            </div>
            <div
              v-for="(item, index) in filters.event"
              :key="`${item}-${index}`"
              class="filter-item no-wrap px-3 py-1">
              {{ item }}
              <NeoIcon
                icon="xmark"
                @click.native="toggleFilter('event', item)" />
            </div>
          </div>
        </div>
      </div>
      <div class="is-flex is-flex-direction-column">
        <NotificationItem
          v-for="(nft, index) in nfts"
          :key="`${nft.id}-${index}`"
          :nft="nft" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import NotificationItem from './NotificationItem.vue'

// for test
import { useCarouselNftEvents } from '@/components/carousel/utils/useCarousel'
const { nfts } = useCarouselNftEvents({ type: 'newestList' })
console.log('🚀 ~ file: NotificationBoxModal.vue:48 ~ nfts:', nfts.value)
// test end

const collections = ref(['Collection 1', 'Collection 2', 'Collection 3'])

const events = ref(['Sale', 'Offer', 'Accepted Offer'])

const { $store, $i18n } = useNuxtApp()

const showFilter = ref(false)

const isFilterEmpty = computed(
  () =>
    filters.value.collection.length === 0 && filters.value.event.length === 0
)

const filters = ref({
  collection: [],
  event: [],
})

const toggleFilter = (key: 'collection' | 'event', target: string) => {
  if (filters.value[key].includes(target)) {
    const index = filters.value[key].indexOf(target)
    filters.value[key].splice(index, 1)
  } else {
    filters.value[key].push(target)
  }
}

const { urlPrefix } = usePrefix()
const emit = defineEmits(['close'])
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.no-wrap {
  white-space: nowrap;
}
.notification-box-modal {
  .notification-modal-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    padding-top: 83px;
    max-width: 360px;
    width: 100%;

    @include mobile {
      padding-top: 58px;
      max-width: 100vw;
    }
    @include ktheme() {
      background: theme('background-color');
      border-left: 1px solid theme('border-color');
    }

    .modal-card-title {
      @include ktheme() {
        color: theme('text-color');
      }
    }

    .modal-card-head {
      background: unset;
      padding: 1rem 2rem;
      @include ktheme() {
        border-bottom: 1px solid theme('border-color');
      }
    }

    .modal-card-body {
      padding: 0rem 2rem 1rem 2rem;
      display: block;
      @include ktheme() {
        background-color: theme('background-color');
      }
    }
    .notification-filter {
      flex-shrink: 0;
      flex-grow: 0;
      position: sticky;
      top: 0;
      @include ktheme() {
        background-color: theme('background-color');
      }
      & > div:last-child {
        @include ktheme() {
          border-bottom: 1px solid theme('k-grey');
        }
      }
      .button-rounded {
        border-radius: 2rem;
      }
      .filter-item {
        border-radius: 2rem;
        cursor: pointer;
        margin-right: 0.25rem;
        &:last-child {
          margin-right: 0;
        }
      }
      .filter-list {
        overflow-x: auto;
        .filter-item {
          @include ktheme() {
            border: 1px solid theme('k-shade');
          }
          &.activated {
            @include ktheme() {
              background-color: theme('k-shade');
            }
          }
        }
      }
      .filter-display-list {
        overflow-x: auto;
        .filter-item {
          @include ktheme() {
            border: 1px solid theme('k-primary');
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.notification-box-modal {
  .modal-content {
    border: none !important;
  }
  .modal-background {
    background-color: rgba(0, 0, 0, 0.17) !important;
  }
}
</style>
