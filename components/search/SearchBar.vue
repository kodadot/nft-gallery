<template>
  <div class="search-bar-container">
    <b-autocomplete
      ref="searchRef"
      v-model="name"
      class="gallery-search"
      :class="{ 'is-collection-search': isSearchInCollectionMode }"
      :placeholder="placeholderContent"
      icon="search"
      :open-on-focus="showDefaultSuggestions"
      dropdown-position="bottom"
      expanded
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.native.delete="exitCollectionSearch"
      @keydown.native.backSpace="exitCollectionSearch"
      @keydown.native.enter="onEnter">
      <template #header>
        <SearchSuggestion
          v-if="!isSearchInCollectionMode"
          ref="searchSuggestionRef"
          :name="name"
          :show-default-suggestions="showDefaultSuggestions"
          :query="query"
          @gotoGallery="$emit('redirect', $event)"
          @close="closeDropDown">
        </SearchSuggestion>
      </template>
    </b-autocomplete>
    <div class="search-bar-bg"></div>
    <div
      v-if="isSearchInCollectionMode"
      class="search-bar-collection-search is-flex is-align-items-center">
      <span class="is-flex is-align-items-center">{{
        $t('search.searchCollection')
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
      class="search-bar-keyboard-icon"
      :class="{ 'is-invisible': name || inputFocused }"
      src="/search-k-keyboard.svg" />
    <img
      class="search-bar-keyboard-icon"
      :class="{ 'is-invisible': !name && !inputFocused }"
      src="/k-search-enter.svg" />
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Ref,
  VModel,
  Watch,
  mixins,
} from 'nuxt-property-decorator'
import { SearchQuery } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'

@Component({
  components: {
    SearchSuggestion: () => import('./SearchSuggestion.vue'),
  },
})
export default class SearchBar extends mixins(
  PrefixMixin,
  KeyboardEventsMixin
) {
  @Prop({ type: Object, required: false }) public query!: SearchQuery
  @VModel({ type: String }) name!: string
  @Ref('searchRef') readonly searchRef
  @Ref('searchSuggestionRef') readonly searchSuggestionRef
  private enableSearchInCollection = true
  public inputFocused = false

  public created() {
    this.initKeyboardEventHandler({
      k: this.bindSearchEvents,
    })
  }

  get isCollectionPage() {
    return this.$route.name === 'prefix-collection-id'
  }

  get isSearchInCollectionMode() {
    return this.enableSearchInCollection && this.isCollectionPage
  }

  get placeholderContent() {
    return this.inputFocused || this.isSearchInCollectionMode
      ? ''
      : this.$t('general.searchPlaceholder')
  }

  get showDefaultSuggestions() {
    return this.urlPrefix === 'rmrk' || this.urlPrefix === 'bsx'
  }

  public exitCollectionSearch() {
    if (this.isSearchInCollectionMode && !this.name) {
      this.enableSearchInCollection = false
    }
  }

  @Emit('enter')
  @Emit('redirect')
  onEnter() {
    this.closeDropDown()
    this.searchRef?.$refs?.input?.$refs?.input?.blur()
    // insert search term in history
    this.searchSuggestionRef?.insertNewHistory()
  }

  public focusInput(): void {
    this.searchRef?.focus()
  }

  public onInputFocus(): void {
    this.inputFocused = true
  }

  public onInputBlur(): void {
    this.$emit('blur')
    this.inputFocused = false
    this.enableSearchInCollection = true
  }

  private bindSearchEvents(event) {
    event.preventDefault()
    if (
      event.key === 'k' &&
      this.searchRef?.$el?.getBoundingClientRect()?.top > 0
    ) {
      this.focusInput()
    }
  }

  public closeDropDown() {
    this.searchRef.isActive = false
  }

  @Watch('isSearchInCollectionMode')
  private onSearchInCollectionModeChanged() {
    const { replaceUrl } = useReplaceUrl()
    replaceUrl({
      collections: this.isSearchInCollectionMode
        ? this.$route.params.id
        : undefined,
    })
  }
}
</script>
