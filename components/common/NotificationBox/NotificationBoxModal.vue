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
            <div class="is-flex is-flex-wrap-wrap filter-list">
              <div
                v-for="(item, index) in collections"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 mb-1 no-wrap"
                :class="{
                  activated: collectionFilter?.id === item.id,
                }"
                @click="toggleCollectionFilter(item)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="is-flex is-flex-direction-column pb-4">
            <span class="is-size-7 has-text-grey mb-2">{{
              $t('notification.byEvent')
            }}</span>
            <div class="is-flex is-flex-wrap-wrap filter-list">
              <div
                v-for="(item, index) in eventTypes"
                :key="`${item}-${index}`"
                class="filter-item px-3 py-1 no-wrap"
                :class="{
                  activated: eventFilter.some((x) => x.id === item.id),
                }"
                @click="toggleEventFilter(item)">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!showFilter && !isFilterEmpty" class="filter-option">
          <div class="is-flex filter-display-list pb-3 is-flex-wrap-wrap">
            <div
              v-if="collectionFilter"
              class="filter-item no-wrap mr-1 px-3 py-1 mb-1">
              {{ collectionFilter.name }}
              <NeoIcon icon="xmark" @click.native="collectionFilter = null" />
            </div>
            <div
              v-for="event in eventFilter"
              :key="event.id"
              class="filter-item no-wrap px-3 py-1 mb-1">
              {{ event.name }}
              <NeoIcon icon="xmark" @click.native="toggleEventFilter(event)" />
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

const collectionFilter = ref<FilterOption | null>(null)
const toggleCollectionFilter = (target: FilterOption) => {
  if (collectionFilter.value?.id === target.id) {
    collectionFilter.value = null
  } else {
    collectionFilter.value = target
  }
}

const eventFilter = ref<FilterOption[]>([])
const toggleEventFilter = (target: FilterOption) => {
  const index = eventFilter.value.findIndex(
    (x: FilterOption) => x.id === target.id
  )
  if (index === -1) {
    eventFilter.value.push(target)
  } else {
    eventFilter.value.splice(index, 1)
  }
}

const showFilter = ref(false)
const isFilterEmpty = computed(
  () => !collectionFilter.value && eventFilter.value.length === 0
)

const displayedEvents = ref<Event[]>([])

const doSearch = () => {
  displayedEvents.value = allEvents.value.filter(
    (item) =>
      (!collectionFilter.value ||
        collectionFilter.value.id === item.nft.collection.id) &&
      (eventFilter.value.length === 0 ||
        eventFilter.value.some((x) => x.id === item.interaction))
  )
}

watch(allEvents, doSearch, {
  immediate: true,
})

watch(collectionFilter, doSearch, { deep: true })
watch(eventFilter, doSearch, { deep: true })

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
