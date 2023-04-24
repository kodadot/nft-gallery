<template>
  <div
    v-if="isOpen"
    class="notification-modal-container theme-background-color border-left is-flex is-flex-direction-column">
    <header
      class="py-4 px-6 is-flex is-justify-content-space-between border-bottom mb-4">
      <span class="control-label is-size-6 has-text-weight-bold">
        {{ $t('notification.notifications') }}
      </span>
      <a class="is-flex is-align-items-center" @click="closeModal">
        <NeoIcon icon="close" />
      </a>
    </header>
    <div class="px-0 pt-0 pb-3 theme-background-color">
      <div class="notification-filter theme-background-color px-6 pb-5">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center pb-4">
          <span> {{ $t('notification.filters') }} </span>
          <NeoButton
            v-if="!showFilter"
            no-shadow
            class="rounded"
            @click.native="showFilter = !showFilter">
            {{ $t('notification.add') }}
            <NeoIcon icon="plus" size="small" />
          </NeoButton>
          <NeoButton
            v-else
            no-shadow
            class="rounded"
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
                class="filter-item rounded is-clickable px-3 mr-1 py-1 mb-1 no-wrap"
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
                v-for="event in eventTypes"
                :key="event"
                class="filter-item rounded is-clickable px-3 mr-1 py-1 no-wrap"
                :class="{
                  activated: eventFilter.includes(event),
                }"
                @click="toggleEventFilter(event)">
                {{ getInteractionName(event) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!showFilter && !isFilterEmpty" class="filter-option">
          <div class="is-flex filter-display-list pb-3 is-flex-wrap-wrap">
            <NeoTag
              v-if="collectionFilter"
              class="no-wrap mr-1 mb-1 rounded"
              @close="collectionFilter = null">
              {{ collectionFilter.name }}
            </NeoTag>
            <NeoTag
              v-for="event in eventFilter"
              :key="event"
              class="no-wrap mb-1 mr-1 rounded"
              @close="toggleEventFilter(event)">
              {{ getInteractionName(event) }}
            </NeoTag>
          </div>
        </div>
      </div>
      <div v-if="loading" class="empty-tip">
        <p>{{ $t('notification.loadingTip') }}</p>
      </div>
      <div v-else>
        <div v-if="allEvents.length === 0" class="empty-tip">
          <p>{{ $t('notification.emptyTipLine1') }}</p>
          <p>{{ $t('notification.emptyTipLine2') }}</p>
        </div>
        <div v-else class="is-flex is-flex-direction-column">
          <NotificationItem
            v-for="(event, index) in displayedEvents"
            :key="`${event.id}-${index}`"
            :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterOption } from './types'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import { usePreferencesStore } from '@/stores/preferences'

import NotificationItem from './NotificationItem.vue'
import {
  Interaction,
  getInteractionName,
  useNotification,
} from './useNotification'

const eventTypes = ref<string[]>([
  Interaction.SALE,
  Interaction.OFFER,
  Interaction.ACCEPTED_OFFER,
])
const collectionFilter = ref<FilterOption | null>(null)
const eventFilter = ref<string[]>([])
const showFilter = ref(false)
const prefrencesStore = usePreferencesStore()
const isOpen = computed({
  get: () => prefrencesStore.getNotificationBoxCollapse,
  set: (value) => prefrencesStore.setNotificationBoxCollapse(value),
})
const emit = defineEmits(['close'])

// properly close modal when being closed from outside,e.g. by changeing chain
watch(isOpen, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close')
  }
})

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const { collections, events: allEvents, loading } = useNotification()

const toggleCollectionFilter = (target: FilterOption) => {
  if (collectionFilter.value?.id === target.id) {
    collectionFilter.value = null
  } else {
    collectionFilter.value = target
  }
}

const toggleEventFilter = (target) => {
  const index = eventFilter.value.findIndex((x) => x === target)
  if (index === -1) {
    eventFilter.value.push(target)
  } else {
    eventFilter.value.splice(index, 1)
  }
}

const isFilterEmpty = computed(
  () => !collectionFilter.value && eventFilter.value.length === 0
)

const displayedEvents = computed(() =>
  allEvents.value.filter(
    (item) =>
      (!collectionFilter.value ||
        collectionFilter.value.id === item.nft.collection?.id) &&
      (eventFilter.value.length === 0 ||
        eventFilter.value.some((x) => x === item.interaction))
  )
)
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
.rounded {
  border-radius: 2rem;
  overflow: hidden;
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

    .modal-card-head {
      background: unset;
    }

    .notification-filter {
      flex-shrink: 0;
      flex-grow: 0;
      position: sticky;
      top: 0;
      z-index: 1;
      & > div:last-child {
        @include ktheme() {
          border-bottom: 1px solid theme('k-grey');
        }
      }

      .filter-item {
        &:last-child {
          margin-right: 0;
        }
      }
      .filter-list {
        .filter-item {
          @include ktheme() {
            border: 1px solid theme('k-shade');
            &:hover {
              border-color: theme('border-color');
            }
            &.activated {
              color: theme('black');
              background-color: theme('k-shade');
            }
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
    box-shadow: none !important;
  }
  .modal-background {
    background-color: rgba(0, 0, 0, 0.17) !important;
  }
}
</style>
