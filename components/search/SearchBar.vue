<template>
  <div class="search-bar-container">
    <NeoAutocomplete
      ref="searchRef"
      v-model="name"
      :root-class="`gallery-search ${
        isCollectionSearchMode && 'is-collection-search'
      }`"
      :class="{
        'gallery-search--skip-button': isTouchDevice,
      }"
      :placeholder="placeholderContent"
      icon="search"
      icon-pack="fasr"
      :open-on-focus="showDefaultSuggestions"
      menu-position="bottom"
      expanded
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.delete="exitCollectionSearch"
      @keydown.backSpace="exitCollectionSearch"
      @keydown.enter="onEnter">
      <template v-if="!isCollectionSearchMode" #header>
        <SearchSuggestion
          ref="searchSuggestionRef"
          :name="name"
          :show-default-suggestions="showDefaultSuggestions"
          :query="query"
          @goto-gallery="$emit('redirect', $event)"
          @close="closeDropDown">
        </SearchSuggestion>
      </template>
    </NeoAutocomplete>
    <div class="search-bar-bg"></div>
    <div
      v-if="isCollectionSearchMode"
      class="search-bar-collection-search is-flex is-align-items-center">
      <span class="is-flex is-align-items-center">{{
        $i18n.t('search.searchCollection')
      }}</span>
      <svg
        width="7"
        height="14"
        viewBox="0 0 7 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.544 0.32L1.648 13.12H0.448L5.344 0.32H6.544Z"
          fill="#999999" />
      </svg>
    </div>
    <img
      v-if="!isTouchDevice"
      class="search-bar-keyboard-icon"
      :class="{ 'is-invisible': name || inputFocused }"
      src="/search-k-keyboard.svg"
      alt="press k to focus search input" />
    <img
      v-if="!isTouchDevice"
      class="search-bar-keyboard-icon"
      :class="{ 'is-invisible': !name && !inputFocused }"
      src="/k-search-enter.svg"
      alt="press enter to start search" />
  </div>
</template>

<script setup lang="ts">
import { NeoAutocomplete } from '@kodadot1/brick'
import { useCollectionSearch } from '@/components/search/utils/useCollectionSearch'
import SearchSuggestion from '@/components/search/SearchSuggestion.vue'
import { SearchQuery } from './types'
import type { PropType } from 'vue'
import { document } from '@/services/browserAPIs'

const isTouchDevice = 'ontouchstart' in (document?.documentElement || {})

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  query: Object as PropType<SearchQuery>,
})

const emits = defineEmits(['update:modelValue', 'blur', 'enter', 'redirect'])
const { $i18n } = useNuxtApp()

const name = useVModel(props, 'modelValue', emits, {
  eventName: 'update:modelValue',
})

const searchRef = ref<InstanceType<typeof NeoAutocomplete>>()
const searchSuggestionRef = ref<InstanceType<typeof SearchSuggestion>>()
const enableSearchInCollection = ref(true)
const inputFocused = ref(false)
const { urlPrefix } = usePrefix()

const { isCollectionSearchMode, setCollectionSearchMode } =
  useCollectionSearch()
useKeyboardEvents({ k: bindSearchEvents })

const placeholderContent = computed(() =>
  inputFocused.value || isCollectionSearchMode.value
    ? ''
    : $i18n.t('general.searchPlaceholder'),
)

const showDefaultSuggestions = computed(
  () => urlPrefix.value === 'rmrk' || urlPrefix.value === 'bsx',
)

function exitCollectionSearch() {
  if (isCollectionSearchMode.value && !name.value) {
    enableSearchInCollection.value = false
  }
}

function onEnter() {
  closeDropDown()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value?.$refs?.input?.$refs?.input?.blur()
  // insert search term in history
  searchSuggestionRef.value?.insertNewHistory()
  emits('enter')
}

function focusInput() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value?.focus()
}

function onInputFocus() {
  inputFocused.value = true
}

function onInputBlur() {
  emits('blur')
  inputFocused.value = false
  if (!name.value) {
    enableSearchInCollection.value = true
  }
}

function bindSearchEvents(event: KeyboardEvent) {
  event.preventDefault()
  if (
    event.key === 'k' &&
    searchRef.value?.$el?.getBoundingClientRect()?.top > 0
  ) {
    focusInput()
  }
}

function closeDropDown() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  searchRef.value.isActive = false
}

watch(
  enableSearchInCollection,
  () => {
    setCollectionSearchMode(enableSearchInCollection.value)
  },
  { immediate: true },
)
</script>
