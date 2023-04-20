<template>
  <div class="search-bar-container">
    <b-autocomplete
      ref="searchRef"
      v-model="name"
      class="gallery-search"
      :placeholder="placeholderContent"
      icon="search"
      :open-on-focus="showDefaultSuggestions"
      dropdown-position="bottom"
      expanded
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.native.enter="onEnter">
      <template #header>
        <SearchSuggestion
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

  public inputFocused = false

  public created() {
    this.initKeyboardEventHandler({
      k: this.bindSearchEvents,
    })
  }

  get placeholderContent() {
    return this.inputFocused ? '' : this.$t('general.searchPlaceholder')
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

  get showDefaultSuggestions() {
    const supportedChains = [
      'rmrk',
      'bsx',
      'ksm',
      'snek',
      // TODO: other chains below got 400 error, check on devtools network panel.
      // 'movr', 'glmr'
    ]
    return supportedChains.includes(this.urlPrefix)
  }
}
</script>
