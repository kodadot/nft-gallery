<template>
  <div
    v-if="isOpen"
    class="notification-modal-container bg-background-color border-l flex flex-col"
    data-testid="notification-modal-container">
    <NeoModalHead
      :title="$t('notification.notifications')"
      @close="closeModal" />
    <div class="px-0 pt-0 pb-3 bg-background-color">
      <div class="notification-filter bg-background-color px-6 pt-4 pb-5">
        <div class="flex justify-between items-center pb-4">
          <span> {{ $t('notification.filters') }} </span>
          <NeoButton
            v-if="!showFilter"
            no-shadow
            class="rounded"
            @click="showFilter = !showFilter">
            {{ $t('notification.add') }}
            <NeoIcon icon="plus" />
          </NeoButton>
          <NeoButton
            v-else
            no-shadow
            class="rounded"
            @click="showFilter = !showFilter">
            {{ $t('notification.done') }}
            <NeoIcon icon="check" />
          </NeoButton>
        </div>
        <div v-if="showFilter" class="filter-option">
          <div v-if="collections.length > 0" class="flex flex-col pb-4">
            <span class="text-xs text-k-grey mb-2">
              {{ $t('notification.byCollection') }}
            </span>
            <div class="flex flex-wrap filter-list">
              <div
                v-for="(item, index) in collections"
                :key="`${item}-${index}`"
                class="filter-item rounded is-clickable px-3 mr-1 py-1 mb-1 whitespace-nowrap"
                :class="{
                  activated: collectionFilter?.id === item.id,
                }"
                @click="toggleCollectionFilter(item)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="flex flex-col pb-4">
            <span class="text-xs text-k-grey mb-2">{{
              $t('notification.byEvent')
            }}</span>
            <div class="flex flex-wrap filter-list">
              <div
                v-for="event in eventTypes"
                :key="event"
                class="filter-item rounded is-clickable px-3 mr-1 py-1 whitespace-nowrap"
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
          <div class="flex filter-display-list pb-3 flex-wrap">
            <NeoTag
              v-if="collectionFilter"
              class="whitespace-nowrap mr-1 mb-1 rounded"
              closable
              @close="collectionFilter = null">
              {{ collectionFilter.name }}
            </NeoTag>
            <NeoTag
              v-for="event in eventFilter"
              :key="event"
              class="whitespace-nowrap mb-1 mr-1 rounded"
              closable
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
        <div v-else class="flex flex-col">
          <NotificationItem
            v-for="(event, index) in displayedEvents"
            :key="`${event.id}-${index}`"
            :event="event"
            @click="closeModal(ModalCloseType.NAVIGATION)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterOption } from './types'
import { NeoButton, NeoIcon, NeoModalHead } from '@kodadot1/brick'
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { ModalCloseType } from '@/components/navbar/types'

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

const closeModal = (type: ModalCloseType = ModalCloseType.BACK) => {
  isOpen.value = false
  emit('close', type)
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
  () => !collectionFilter.value && eventFilter.value.length === 0,
)

const displayedEvents = computed(() =>
  allEvents.value.filter(
    (item) =>
      (!collectionFilter.value ||
        collectionFilter.value.id === item.nft.collection?.id) &&
      (eventFilter.value.length === 0 ||
        eventFilter.value.some((x) => x === item.interaction)),
  ),
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
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
    padding-top: $navbar-desktop-min-height;
    max-width: 360px;
    width: 100%;

    @include mobile {
      padding-top: $navbar-mobile-min-height;
      max-width: 100vw;
    }

    .notification-filter {
      flex-shrink: 0;
      flex-grow: 0;
      position: sticky;
      top: 0;
      z-index: 1;
      & > div:last-child {
        @apply border-b border-k-grey;
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
}
</style>
