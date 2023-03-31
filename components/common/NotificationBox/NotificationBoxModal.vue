<template>
  <div class="notification-modal-container is-flex is-flex-direction-column">
    <header class="modal-card-head mb-4">
      <span class="modal-card-title is-size-6 has-text-weight-bold">
        {{ $t('notification.notifications') }}
      </span>
      <a class="is-flex is-align-items-center" @click="emit('close')">
        <NeoIcon icon="close" />
      </a>
    </header>
    <div class="modal-card-body">
      <div class="notification-filter pb-5">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center pb-4">
          <span> {{ $t('notification.filters') }} </span>
          <NeoButton
            v-if="!showFilter"
            no-shadow
            class="button-rounded"
            @click.native="showFilter = !showFilter">
            {{ $t('notification.add') }}
            <NeoIcon icon="plus" size="small" />
          </NeoButton>
          <NeoButton
            v-else
            no-shadow
            class="button-rounded"
            @click.native="showFilter = !showFilter">
            {{ $t('notification.done') }}
            <NeoIcon icon="check" size="small" />
          </NeoButton>
        </div>
        <div v-if="showFilter" class="filter-option">
          <div
            v-if="collections.length > 0"
            class="is-flex is-flex-direction-column pb-4">
            <span class="is-size-7 has-text-grey mb-2">
              {{ $t('notification.byCollection') }}
            </span>
            <div class="is-flex filter-list">
              <div
                v-for="(item, index) in collections"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 no-wrap"
                :class="{
                  activated: isInFilter('collection', item),
                }"
                @click="toggleFilter('collection', item)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="is-flex is-flex-direction-column pb-4">
            <span class="is-size-7 has-text-grey mb-2">{{
              $t('notification.byEvent')
            }}</span>
            <div class="is-flex filter-list">
              <div
                v-for="(item, index) in eventTypes"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 no-wrap"
                :class="{
                  activated: isInFilter('event', item),
                }"
                @click="toggleFilter('event', item)">
                {{ item.name }}
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
              {{ item.name }}
              <NeoIcon
                icon="xmark"
                @click.native="removeFilter('collection', item)" />
            </div>
            <div
              v-for="(item, index) in filters.event"
              :key="`${item}-${index}`"
              class="filter-item no-wrap px-3 py-1">
              {{ item.name }}
              <NeoIcon
                icon="xmark"
                @click.native="removeFilter('event', item)" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="displayedEvents.length === 0" class="empty-tip">
        <p v-html="$t('notification.emptyTip')"></p>
      </div>
      <div v-else class="is-flex is-flex-direction-column">
        <NotificationItem
          v-for="(event, index) in displayedEvents"
          :key="`${event.id}-${index}`"
          :event="event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event, FilterOption } from './types'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark'
import NotificationItem from './NotificationItem.vue'
import { useNotification } from './useNotification'
const { $i18n, $store } = useNuxtApp()
type FilterType = 'collection' | 'event'
const eventTypes = ref<FilterOption[]>([
  {
    id: Interaction.BUY,
    name: $i18n.t('filters.buy'),
  },
  {
    // TODO
    id: 'Offer',
    name: $i18n.t('filters.offer'),
  },
  {
    // TODO
    id: 'Accepted Offer',
    name: $i18n.t('filters.acceptedOffer'),
  },
])
const { collections, events: allEvents } = useNotification(
  $store.getters.getAuthAddress
)
const showFilter = ref(false)
const isFilterEmpty = computed(
  () =>
    filters.value.collection.length === 0 && filters.value.event.length === 0
)
const filters = ref<{
  collection: FilterOption[]
  event: FilterOption[]
}>({
  collection: [],
  event: [],
})
const isInFilter = (key: FilterType, target: FilterOption) => {
  return filters.value[key].some((x) => x.id === target.id)
}
const toggleFilter = (key: FilterType, target: FilterOption) => {
  if (isInFilter(key, target)) {
    const index = filters.value[key].findIndex((x) => x.id === target.id)
    filters.value[key].splice(index, 1)
  } else {
    filters.value[key].push(target)
  }
}
const displayedEvents = ref<Event[]>([])
const doSearch = () => {
  const { collection, event } = filters.value
  displayedEvents.value = allEvents.value
  if (collection.length > 0) {
    displayedEvents.value = displayedEvents.value.filter((item) =>
      collection.some((x) => x.id === item.nft.collection.id)
    )
  }
  if (event.length > 0) {
    displayedEvents.value = displayedEvents.value.filter((item) =>
      event.some((x) => x.id === item.interaction)
    )
  }
}

const removeFilter = (key: FilterType, target: FilterOption) => {
  toggleFilter(key, target)
  doSearch()
}
watch(allEvents, doSearch, {
  immediate: true,
})
watch(filters, doSearch, { deep: true })
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
    .empty-tip {
      @include ktheme() {
        color: theme('k-grey');
        text-align: center;
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
