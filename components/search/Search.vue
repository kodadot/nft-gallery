<template>
  <div>
    <div v-if="!isVisible && !hideSearchInput" class="row">
      <div v-if="priceRangeDirty && !hideFilter" class="is-size-7">
        <PriceRange inline />
      </div>
    </div>
    <div class="columns mb-0">
      <b-field class="column is-8 mb-0 mr-2" :class="searchColumnClass">
        <b-button
          v-if="!hideFilter"
          icon-left="filter"
          aria-controls="sortAndFilter"
          type="is-primary is-bordered-light"
          class="is-hidden-mobile mr-2"
          data-cy="expand-search"
          @click="isVisible = !isVisible" />
        <slot name="next-filter"></slot>
        <SearchBarInput
          v-if="!hideSearchInput"
          ref="searchRef"
          v-model="name"
          :query="query"
          @enter="nativeSearch"
          @blur="onBlur"></SearchBarInput>
        <div v-if="!isVisible && hideSearchInput">
          <div v-if="priceRangeDirty" class="is-size-7">
            <PriceRange inline />
          </div>
        </div>
      </b-field>
      <b-field
        v-if="!hideFilter"
        expanded
        position="is-right"
        class="column is-4">
        <b-button
          icon-left="filter"
          aria-controls="sortAndFilter"
          type="is-primary"
          class="is-hidden-tablet mr-2"
          @click="isVisible = !isVisible" />
        <slot />
      </b-field>
    </div>
    <b-collapse
      v-model="isVisible"
      aria-id="sortAndFilter"
      animation="opacitySlide">
      <div class="columns mb-0">
        <BasicSwitch
          v-if="!isMoonRiver"
          v-model="vListed"
          class="is-flex column is-4"
          :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'"
          size="is-medium"
          label-color="has-text-success" />
      </div>
      <SearchPriceRange
        v-if="!hideFilter && !isMoonRiver"
        :range="priceRange"
        @input="priceRangeChange"></SearchPriceRange>
      <div v-if="priceRangeDirty" class="is-size-7">
        <PriceRange inline />
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Ref,
  Watch,
  mixins,
} from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { exist, existArray } from './exist'
import { SearchQuery } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'
import ChainMixin from '~/utils/mixins/chainMixin'
import { usePreferencesStore } from '@/stores/preferences'

@Component({
  components: {
    SearchBarInput: () => import('./SearchBar.vue'),
    SearchPriceRange: () => import('./SearchPriceRange.vue'),
    Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
    BasicSwitch: () => import('@/components/shared/form/BasicSwitch.vue'),
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
    PriceRange: () => import('@/components/shared/format/PriceRange.vue'),
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class Search extends mixins(
  PrefixMixin,
  KeyboardEventsMixin,
  ChainMixin
) {
  @Prop(String) public search!: string
  @Prop(String) public type!: string
  @Prop({ type: Array, default: () => [] }) public sortByMultiple!: string[]
  @Prop(String) public searchColumnClass!: string
  @Prop({ type: Boolean, default: false }) public listed!: boolean
  @Prop(Boolean) public hideFilter!: boolean
  @Prop(Boolean) public isMoonRiver!: boolean
  @Prop(Boolean) public hideSearchInput!: boolean
  @Ref('searchRef') readonly searchRef
  public isVisible = false
  public query: SearchQuery = {
    search: this.$route.query?.search?.toString() ?? '',
    type: this.$route.query?.type?.toString() ?? '',
    sortByMultiple: this.sortByMultiple ?? [],
    listed: this.$route.query?.listed?.toString() === 'true',
  }
  public name = ''
  public priceRange: [
    number | string | undefined,
    number | string | undefined
  ] = [undefined, undefined]
  public priceRangeDirty = false
  private preferencesStore = usePreferencesStore()

  get urlSearchQuery() {
    return this.$route.query.search
  }

  // clear search bar value when search is cannceled via breadcrumbs
  @Watch('urlSearchQuery')
  syncSearchfromUrl(urlSearchQuery) {
    if (urlSearchQuery == undefined) {
      this.name = ''
    }
  }

  public created() {
    this.initKeyboardEventHandler({
      f: this.bindFilterEvents,
    })
    if (!this.name && this.$route.query.search) {
      this.name = Array.isArray(this.$route.query.search)
        ? ''
        : this.$route.query.search
    }
  }

  public mounted(): void {
    exist(this.$route.query.search, this.updateSearch)
    exist(this.$route.query.min, (v) => this.updatePriceRangeByQuery(v))
    exist(this.$route.query.max, (v) =>
      this.updatePriceRangeByQuery(undefined, v)
    )
    existArray(this.$route.query.sort as string[], this.updateSortBy)
    exist(this.$route.query.listed, this.updateListed)
  }

  private bindFilterEvents(event) {
    switch (event.key) {
      case 'b':
        this.updateListed(!this.vListed)
        break
      case 'n':
        this.updateSortBy(['BLOCK_NUMBER_DESC'])
        break
      case 'o':
        this.updateSortBy(['BLOCK_NUMBER_ASC'])
        break
      case 'e':
        this.updateSortBy(['PRICE_DESC'])
        break
      case 'c':
        this.updateSortBy(['PRICE_ASC'])
        break
    }
  }

  get vListed(): boolean {
    this.query.listed = this.listed
    return this.listed
  }

  set vListed(
    listed: boolean | { listed: boolean; min?: string; max?: string }
  ) {
    this.updateListed(listed)
  }

  get searchQuery(): string {
    return this.search
  }

  set searchQuery(value: string) {
    this.updateSearch(value)
  }

  get replaceBuyNowWithYolo(): boolean {
    return this.preferencesStore.getReplaceBuyNowWithYolo
  }

  @Emit('update:listed')
  @Debounce(50)
  updateListed(
    value: string | boolean | { listed: boolean; min?: string; max?: string }
  ): boolean {
    let v = ''
    if (typeof value === 'string' || typeof value === 'boolean') {
      v = String(value)
      this.replaceUrl({ listed: v })
    } else {
      const { listed, max, min } = value
      v = String(listed)
      this.replaceUrl({
        listed,
        max,
        min,
      })
    }
    return v === 'true'
  }

  @Emit('update:sortByMultiple')
  @Debounce(400)
  updateSortBy(value: string[] | string, $event?): string[] {
    const final = (Array.isArray(value) ? value : [value]).filter((condition) =>
      NFT_SQUID_SORT_CONDITION_LIST.includes(condition)
    )
    const listed = final.some(
      (condition) => condition.toLowerCase().indexOf('price') > -1
    )
    if (listed && !this.vListed) {
      this.vListed = true
    }

    if ($event?.length > final.length || !$event) {
      this.replaceUrl({ sort: final })
      return final
    }
    let newFinal: string[] = []
    if (final.length > 0) {
      const newlySelected = final[final.length - 1].split('_')[0]
      newFinal = $event.filter(
        (option) => option.split('_')[0] !== newlySelected
      )
      newFinal.push(final[final.length - 1])
    }
    this.replaceUrl({ sort: newFinal })
    return newFinal
  }

  onBlur() {
    this.updateSearch(this.name)
  }

  @Emit('update:search')
  @Debounce(50)
  updateSearch(value: string): string {
    if (value !== this.$route.query.search && value !== this.searchQuery) {
      this.replaceUrl({ search: value ? value : undefined }, this.$route.path)
    }
    return value
  }

  updatePriceRangeByQuery(minValue?: string, maxValue?: string) {
    const min = Number(minValue)
    const max = Number(maxValue)
    if (Number.isNaN(min) && Number.isNaN(max)) {
      return
    }
    this.priceRangeDirty = true
    if (minValue) {
      this.priceRange = [min, this.priceRange[1]]
      this.priceRangeChangeMin(min * 10 ** this.decimals)
    } else {
      this.priceRange = [this.priceRange[0], max]
      this.priceRangeChangeMax(max * 10 ** this.decimals)
    }
  }

  nativeSearch() {
    this.searchQuery = this.name
    this.updateSearch(this.name)
  }

  public focusInput(): void {
    this.searchRef?.focusInput()
  }

  @Debounce(100)
  replaceUrl(queryCondition: { [key: string]: any }, pathName?: string): void {
    if (pathName && pathName !== this.$route.path) {
      return
    }
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          page: '1',
          ...this.$route.query,
          search: this.searchQuery || this.$route.query.search || undefined,
          ...queryCondition,
        },
      })
      .catch(this.$consola.warn)
    // if searchbar request or filter is set, pagination should always revert to page 1
    this.$emit('resetPage')
  }

  public priceRangeChange([min, max]: [
    number | undefined,
    number | undefined
  ]): void {
    this.priceRangeDirty = true
    this.priceRangeChangeMin(min ? min * 10 ** this.decimals : undefined)
    this.priceRangeChangeMax(max ? max * 10 ** this.decimals : undefined)
    const priceMin = min ? String(min) : undefined
    const priceMax = max ? String(max) : undefined
    this.query.listed = true
    this.vListed = { listed: true, min: priceMin, max: priceMax }
  }

  @Emit('update:priceMin')
  private priceRangeChangeMin(min?: number): void {
    this.query.priceMin = min
  }

  @Emit('update:priceMax')
  private priceRangeChangeMax(max?: number): void {
    this.query.priceMax = max
  }
}
</script>
